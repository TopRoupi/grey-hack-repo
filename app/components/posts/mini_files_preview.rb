# frozen_string_literal: true

class Posts::MiniFilesPreview < ApplicationComponent
  def initialize(fileable:)
    @fileable = fileable
    @build = if @fileable.instance_of? Build
      fileable
    else
      fileable.find_build
    end
  end
end
