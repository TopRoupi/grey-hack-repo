# frozen_string_literal: true

class PostsController < ApplicationController
  before_action :authenticate_user!, only: [:new, :create, :edit, :update, :destroy]
  before_action :set_post, only: %i[edit update destroy]

  # GET /posts or /posts.json
  def index
    @posts = Post.last(10)
  end

  # GET /posts/1 or /posts/1.json
  def show
    @post = Post.eager_load(:user, :category, :scripts, :stars, comments: [:user]).with_rich_text_readme.friendly.find(params[:id])
  end

  # GET /posts/new
  def new
    @post = session.fetch(:forms, {}).fetch("Post", Post.new)
  end

  # GET /posts/1/edit
  def edit
    @post = session.fetch(:forms, {}).fetch("Post_#{params[:id]}", @post)
  end

  # POST /posts or /posts.json
  def create
    @post = Post.new(post_params)
    @post.user = current_user

    respond_to do |format|
      if @post.save
        session[:forms]&.delete "Post"
        format.html { redirect_to @post, notice: "Post was successfully created." }
        format.json { render :show, status: :created, location: @post }
      else
        session[:forms] ||= {}
        session[:forms]["Post"] = @post
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /posts/1 or /posts/1.json
  def update
    respond_to do |format|
      if @post.update(post_params)
        session[:forms]&.delete "Post_#{@post.id}"
        format.html { redirect_to @post, notice: "Post was successfully updated." }
        format.json { render :show, status: :ok, location: @post }
      else
        session[:forms] ||= {}
        session[:forms]["Post_#{@post.id}"] = @post
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1 or /posts/1.json
  def destroy
    @post.destroy
    respond_to do |format|
      format.html { redirect_back fallback_location: root_path, status: :see_other, notice: "Post was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_post
    @post = Post.friendly.find(params[:id])
    redirect_to :root, alert: "action not permitted" if @post.user != current_user
  end

  # Only allow a list of trusted parameters through.
  def post_params
    params.require(:post).permit(
      [
        :title,
        :category_id,
        :summary,
        :readme,
        Fileable.strong_params(params[:post])
      ].flatten
    )
  end
end
