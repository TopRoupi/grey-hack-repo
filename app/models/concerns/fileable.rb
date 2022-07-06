# frozen_string_literal: true

module Fileable
  extend ActiveSupport::Concern

  included do
    has_many :scripts, as: :scriptable, dependent: :destroy
    has_many :folders, as: :foldable, dependent: :destroy

    accepts_nested_attributes_for :scripts, allow_destroy: true
    accepts_nested_attributes_for :folders, allow_destroy: true

    amoeba do
      enable
    end
  end

  def has_script?
    if scripts.any?
      return true
    end
    folders.select { |f| f.has_script? }.any?
  end

  def path_list
    if respond_to? :foldable
      foldable.path_list << self
    else
      [self]
    end
  end

  def path
    if instance_of? Build
      "#{post.friendly_id}_#{name}"
    else
      name
    end
  end

  def children_index_table(table = {}, parent = nil, &parser)
    index = table.size
    table[index] = parser ? parser.call(self, parent) : self
    parent = index
    index += 1

    scripts.each do |script|
      table[index] = parser ? parser.call(script, parent) : script
      index += 1
    end

    folders.each do |folder|
      table = folder.children_index_table(table, parent, &parser)
    end

    table
  end
end
