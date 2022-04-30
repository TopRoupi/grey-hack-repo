# frozen_string_literal: true

class Posts::MiniFilesPreview < ApplicationComponent
  def initialize(fileable:)
    @fileable = fileable
  end
end
