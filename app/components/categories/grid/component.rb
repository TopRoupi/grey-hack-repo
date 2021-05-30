# frozen_string_literal: true

class Categories::Grid::Component < ApplicationComponent
  def initialize(categories:)
    @categories = categories
  end
end
