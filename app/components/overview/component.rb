# frozen_string_literal: true

class Overview::Component < ApplicationComponent
  def initialize(categories: Category.all, posts: nil)
    @categories = categories
    @posts = posts || Post.eager_load(:category, :user).order(updated_at: :desc).last(10)
  end
end
