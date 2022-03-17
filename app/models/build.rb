# frozen_string_literal: true

class Build < ApplicationRecord
  attr_accessor :updated # required to prevent the set_files/Filejob from infinite looping
  belongs_to :post
  include Fileable
  has_one_attached :files
  after_commit :set_files, on: [:update, :create]

  def set_files
    FileJob.perform_later(self, file_name: "#{post.title} | #{name}") unless @updated
  end

  def export_string
    children_index_table do |obj, parent|
      output = {}
      output[:parent] = parent.to_s
      output[:type] = obj.instance_of?(Script) ? "script" : "folder"
      output[:name] = obj.name
      output[:content] = obj.content if obj.respond_to? :content

      output
    end.to_json
  end

  def self.parse_string(string, name = nil)
    obj = JSON.parse(string)
    build = new(name: name || obj["0"]["name"])

    parse_folder(obj, "0", build)

    build
  end

  def self.parse_folder(obj, parent_index, parent)
    children = obj.filter do |_, value|
      value["parent"] == parent_index
    end

    children.each do |key, value|
      case value["type"]
      when "script"
        parent.scripts << Script.new(name: value["name"], content: value["content"])
      when "folder"
        folder = Folder.new(name: value["name"])
        parent.folders << folder
        parse_folder(obj, key, folder)
      end
    end
  end

  private_class_method :parse_folder
end
