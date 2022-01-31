# frozen_string_literal: true

class UsersController < ApplicationController
  def show
    @user = User.friendly.find(params[:id])
    @category = params[:category] || "all"

    @posts = @user.posts.eager.asc.all.public_visibility
    @posts = @posts.where(category_id: @category) if @category != "all"

    @category_pagy, @posts = pagy @posts, items: 5, page_param: "cpage"

    @stars_pagy, @starred_posts = pagy(@user.starable_posts.eager.order('"stars_posts"."created_at"': :desc).public_visibility, items: 5)
  end
end
