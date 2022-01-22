# frozen_string_literal: true

class Overview::Component < ApplicationComponent
  def initialize(categories: Category.all, posts: nil, pagy: nil)
    @categories = categories
    @pagy = pagy
    @posts = posts || Post.eager.order(updated_at: :desc)
  end
end
