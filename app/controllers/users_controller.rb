# frozen_string_literal: true

class UsersController < ApplicationController
  def show
    @user = User.friendly.find(params[:id])
    @category = params[:category] || "all"

    made_up_categories = ["all", "private", "public", "not_listed"]

    @posts = @user.posts.eager.asc
    @posts = @posts.where(category_id: @category) unless made_up_categories.include?(@category)
    if current_user && current_user == @user
      @posts = @posts.private_visibility if @category == "private"
      @posts = @posts.not_listed_visibility if @category == "not_listed"
      @posts = @posts.public_visibility if @category != "private" && @category != "not_listed"
    else
      @posts = @posts.public_visibility
    end

    @category_pagy, @posts = pagy @posts, items: 5, page_param: "cpage"

    @stars_pagy, @starred_posts = pagy(@user.starable_posts.eager.order('"stars_posts"."created_at"': :desc).public_visibility, items: 5)
  end
end
