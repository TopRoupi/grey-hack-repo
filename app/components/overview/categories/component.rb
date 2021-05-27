# frozen_string_literal: true

class Overview::Categories::Component < ApplicationComponent
  def initialize(categories:)
    @categories = categories
  end
end
