# frozen_string_literal: true

class CategoriesController < ApplicationController
  def show
    @category = Category.friendly.find(params[:id])
    @posts = Post.eager.asc.where(category: @category)
  end
end
