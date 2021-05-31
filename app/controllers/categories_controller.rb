# frozen_string_literal: true

class CategoriesController < ApplicationController
  def show
    @category = Category.friendly.find(params[:id])
    @posts = Post.eager_load(:category, :user).order(updated_at: :desc).where(category: @category)
  end
end
