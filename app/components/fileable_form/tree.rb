# frozen_string_literal: true

class FileableForm::Tree < ApplicationComponent
  attr_accessor :files, :depth

  def initialize(fileable:, depth: 0)
    @fileable = fileable

    @files = []
    @files << @fileable.folders.to_a
    @files << @fileable.scripts.to_a
    @files.flatten!

    @depth = depth
  end

  def file_icon(file)
    return "file" if file.instance_of?(Script)
    "file-directory"
  end

  def file_button(file)
    options = {}

    options[:class] = "flex items-center hover:bg-base-100 px-1 w-full "
    file.find_build.published = true
    options[:class] += file.valid? ? " text-green-400" : " text-red-400"

    build = file.find_build
    options[:href] = post_builds_path(id: build.post.slug, build_id: file.find_build, file_type: file.class.to_s, file_id: file.id)
    options[:style] = "padding-left: #{depth * 10 + 3}px;"

    tag.a(**options) do
      yield
    end
  end

  def tree_controls
    tag.div(class: "flex flex-nowrap pr-2", style: "padding-left: #{depth * 10 + 3}px;") do
      yield
    end
  end

  def test_path_helpers
    [posts_path, posts_url, request.url]
  end
end
