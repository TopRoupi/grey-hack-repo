# frozen_string_literal: true

class PostsController < ApplicationController
  before_action :authenticate_user!, only: [:new, :create, :edit, :update, :destroy, :builds]
  before_action :set_post, only: [:edit, :update, :destroy, :builds, :publish]

  # POST /posts/1/publish
  def publish
    authorize @post

    @post.update published: true
    redirect_to post_builds_path(@post), notice: "Post #{@post.title} published"

    DiscordJob.perform_later(@post)
  end

  # GET /posts/1 or /posts/1.json
  def show
    @post = Post
      .with_rich_text_readme
      .friendly
      .find(params[:id])

    return render_not_found if @post.published == false

    authorize @post

    @comments = @post.comments.order(:created_at)
  end

  # GET /posts/new
  def new
    authorize Post
    @post = Post.new

    @post.visibility = :private
  end

  # GET /posts/1/builds
  def builds
    authorize @post

    @builds = @post.builds.order(created_at: :desc)
    @pagy, @builds = pagy @builds

    @selected_build = @post.builds.find_by(id: params[:build_id]) if params[:build_id]

    @selected_file = params[:file_type].constantize.find_by(id: params[:file_id]) if params[:file_type] && params[:file_id]

    redirect_to post_builds_path if @selected_build&.published == true
  end

  # GET /posts/1/edit
  def edit
    authorize @post
  end

  # POST /posts or /posts.json
  def create
    authorize Post
    @post = Post.new(post_params)
    @post.user = current_user

    respond_to do |format|
      if @post.save
        format.html { redirect_to post_builds_path(@post), notice: "Post was successfully created." }
        format.json { render :show, status: :created, location: @post }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /posts/1 or /posts/1.json
  def update
    authorize @post

    respond_to do |format|
      if @post.update(post_params)
        format.html { redirect_to @post, notice: "Post was successfully updated." }
        format.json { render :show, status: :ok, location: @post }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @post.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /posts/1 or /posts/1.json
  def destroy
    authorize @post

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
  end

  # Only allow a list of trusted parameters through.
  def post_params
    params.require(:post).permit(
      :title,
      :category_id,
      :summary,
      :readme,
      :visibility
    )
  end
end
