# frozen_string_literal: true

class Overview::Component < ApplicationComponent
  def initialize
    @categories = Category.all
    @posts = Post.eager_load(:category, :user).last(10)
  end
end
