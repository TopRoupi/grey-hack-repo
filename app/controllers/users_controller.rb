# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!, only: [:myposts]

  def show
    @user = User.friendly.find(params[:id])
    @category = params[:category] || "all"

    made_up_categories = ["all", "private", "public", "not_listed"]

    @posts = @user.posts.published.eager.asc
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

  def myposts
    @posts = current_user.posts.order(created_at: :desc)
    @posts = @posts.where(published: params[:published] || true)
    @pagy, @posts = pagy @posts
  end

  def posts
    show
    render(Users::PostsBox.new(user: @user, current_user: current_user, posts: @posts, pagy: @category_pagy, active_tab: @category), layout: false)
  end
end
