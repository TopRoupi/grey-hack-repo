# frozen_string_literal: true

class Overview::Component < ApplicationComponent
  def initialize(categories: Category.all, posts: nil, pagy: nil)
    @categories = categories
    @pagy = pagy
    @posts = posts || Post.eager_load(:category, :user).order(updated_at: :desc).last(10)
  end
end
