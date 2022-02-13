# frozen_string_literal: true

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
end
