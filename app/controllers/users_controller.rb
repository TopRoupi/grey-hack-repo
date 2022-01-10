# frozen_string_literal: true

class UsersController < ApplicationController
  def show
    @user = User.friendly.find(params[:id])
    @category = params[:category] || "all"

    if @category == "all"
      @category_pagy, @posts = pagy @user.posts.eager.asc.all, items: 5, page_param: "cpage"
    else
      @category_pagy, @posts = pagy @user.posts.eager.asc.where(category_id: @category), items: 5
    end

    @stars_pagy, @starred_posts = pagy(@user.starable_posts.eager.order('"stars_posts"."created_at"': :desc), items: 5)
  end
end
