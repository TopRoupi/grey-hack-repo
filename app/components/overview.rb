# frozen_string_literal: true

class Overview < ApplicationComponent
  def initialize(current_user:, posts:, categories: Category.all, pagy: nil)
    @current_user = current_user
    @categories = categories
    @pagy = pagy
    @posts = posts
  end
end
