# frozen_string_literal: true

class Posts::MiniFilesPreview < ApplicationComponent
  def initialize(fileable:)
    @fileable = fileable
    @export_string = if @fileable.instance_of? Build
      fileable.export_string
    else
      fileable.find_build.export_string
    end
  end
end
