# frozen_string_literal: true

class BuildDiff < ApplicationComponent
  attr_accessor :before, :after, :before_files, :after_files
  def initialize(before:, after:)
    @before = before
    @after = after
    @before_files = build_files_path_hash(@before)
    @after_files = build_files_path_hash(@after)
  end

  def changed_files
    before_files.map do |key, value|
      next if after_files[key].nil?
      next if after_files[key].content == value.content
      [value, after_files[key]]
    end.compact
  end

  def added_files
    after_files.map do |key, value|
      next if before_files[key].nil? == false
      [nil, value]
    end.compact
  end

  def deleted_files
    before_files.map do |key, value|
      next if after_files[key].nil? == false
      [value, nil]
    end.compact
  end

  private

  def build_files_path_hash(build)
    return {} if build.nil?
    build.get_all_scripts.map do |script|
      key = script.scriptable.path_list.map(&:path)[1..].join("/")
      key += "/#{script.name}"
      [key, script]
    end.to_h
  end
end
