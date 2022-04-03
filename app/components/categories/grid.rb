# frozen_string_literal: true

class Categories::Grid < ApplicationComponent
  def initialize(categories:)
    @categories = categories
  end
end
