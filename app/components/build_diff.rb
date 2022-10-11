# frozen_string_literal: true

class BuildDiff < ApplicationComponent
  attr_accessor :before, :after, :before_files, :after_files, :files

  @@icon_styles = {
    modified: {name: "diff-modified", class: "fill-current text-beaver-200"},
    removed: {name: "diff-removed", class: "fill-current text-red-400"},
    added: {name: "diff-added", class: "fill-current text-green-400"}
  }

  def initialize(before:, after:)
    @before = before
    @after = after
    @before_files = build_files_path_hash(@before)
    @after_files = build_files_path_hash(@after)

    @files = []
    @files << changed_files.map { |l| {script: l.first, after: l.last, icon: @@icon_styles[:modified]} }
    @files << deleted_files.map { |l| {script: l.first, after: l.last, icon: @@icon_styles[:removed]} }
    @files << added_files.map { |l| {script: l.last, after: l.first, icon: @@icon_styles[:added]} }
    @files.flatten!
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
