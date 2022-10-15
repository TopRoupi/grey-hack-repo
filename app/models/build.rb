# frozen_string_literal: true

# == Schema Information
#
# Table name: builds
#
#  id         :bigint           not null, primary key
#  post_id    :bigint           not null
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  published  :boolean          default(FALSE), not null
#
class BuildValidator < ActiveModel::Validator
  def validate(record)
    if record.has_script? == false && record.published == true
      record.errors.add(:files, "shall have at least 1 script")
    end
  end
end

class Build < ApplicationRecord
  attr_accessor :updated # required to prevent the set_files/Filejob from infinite looping
  belongs_to :post
  include Fileable
  has_one_attached :files

  after_commit :set_files, on: [:update]
  after_commit :update_post_published_status, on: [:destroy]

  validates_with BuildValidator
  validates :name, presence: true, length: {minimum: 3, maximum: 16}

  scope :published, -> { where(published: true) }
  scope :unpublished, -> { where(published: false) }

  def update_post_published_status
    post.update(published: post.builds.published.any?)
  rescue FrozenError
  end

  def ready_to_publish?
    result = true
    result = false if has_script? == false
    self.published = true
    files = get_all_files
    result = false if files.select { |f| f.valid? == false }.any?
    self.published = false

    result
  end

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
    end.to_json.gsub("\\n", "\\...n")
  end

  def self.parse_string(string, name = nil)
    string = string.delete("\n")
    string = string.gsub("\\...n", "\\n")
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
