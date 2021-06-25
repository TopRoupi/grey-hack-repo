# frozen_string_literal: true

class CategoriesController < ApplicationController
  include SortablePosts

  def show
    @category = Category.friendly.find(params[:id])

    set_posts

    @pagy, @posts = pagy @posts.where(category: @category)
  end
end
