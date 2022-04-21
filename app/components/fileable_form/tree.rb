# frozen_string_literal: true

class FileableForm::Tree < ApplicationComponent
  def initialize(fileable:)
    @fileable = fileable
  end
end
