# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!, only: [:myposts, :unlink_github]

  def index
    authorize User

    @users = User.select("users.*, count(posts.id) AS posts_count, sum(posts.stars_count) as stars_count")
      .joins("LEFT OUTER JOIN posts ON posts.user_id = users.id")
      .group("users.id")
      .order("posts_count desc, users.name")
      .having("count(posts.id) > 0")
  end

  def show
    authorize User

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
    authorize User

    @categories = Category.all
    @posts = current_user.posts.includes(:category, :builds).order(created_at: :desc)
    @posts = @posts.where(published: params[:published] || true)
    @pagy, @posts = pagy @posts
  end

  def mygists
    authorize User

    @gists = current_user.gists.order(created_at: :desc)
    @pagy, @gists = pagy @gists
  end

  def posts
    authorize User

    show
    render(Users::PostsBox.new(user: @user, current_user: current_user, posts: @posts, pagy: @category_pagy, active_tab: @category), layout: false)
  end

  def unlink_github
    authorize User

    current_user.update(uid: nil, provider: nil)
    redirect_back fallback_location: root_path, notice: "Github account unlinked"
  end
end
