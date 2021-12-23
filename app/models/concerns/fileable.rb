class FileableValidator < ActiveModel::Validator
  def validate(record)
    unless record.has_script?
      record.errors.add(:files, "shall have at least 1 script")
    end
  end
end

module Fileable
  extend ActiveSupport::Concern

  included do
    has_many :scripts, as: :scriptable, dependent: :destroy
    has_many :folders, as: :foldable, dependent: :destroy

    validates_with FileableValidator

    accepts_nested_attributes_for :scripts, allow_destroy: true
    accepts_nested_attributes_for :folders, allow_destroy: true
  end

  def has_script?
    if scripts.any?
      return true
    end
    folders.select { |f| f.has_script? }.any?
  end

  def children_index_table(table = {})
    index = table.size
    table[index] = self
    index += 1

    scripts.each do |script|
      table[index] = script
      index += 1
    end

    folders.each do |folder|
      table = folder.children_index_table(table)
    end

    table
  end

  def self.strong_params(params)
    depth = get_params_depth(params)
    [
      {scripts_attributes: script_strong_params},
      {folders_attributes: folder_strong_params(depth)}
    ]
  end

  class << self
    private

    def get_params_depth(params, depth = 0)
      if params["folders_attributes"]
        return get_params_depth(params["folders_attributes"], depth)
      end

      params = params.to_unsafe_hash if params.instance_of? ActionController::Parameters
      params.map do |index, attributes|
        if attributes["folders_attributes"]
          get_params_depth(attributes["folders_attributes"], depth) + 1
        else
          0
        end
      end.max
    end

    def script_strong_params
      [:id, :name, :content, :_destroy]
    end

    def folder_strong_params(depth = 0)
      params = [:id, :name, :_destroy, scripts_attributes: script_strong_params]
      params << {folders_attributes: folder_strong_params(depth - 1)} if depth > 0
      params
    end
  end
end
