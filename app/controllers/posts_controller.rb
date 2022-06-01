# frozen_string_literal: true

class PostsController < ApplicationController
  before_action :authenticate_user!, only: [:new, :create, :edit, :update, :destroy, :builds]
  before_action :set_post, only: [:edit, :update, :destroy, :builds]

  # GET /posts or /posts.json
  def index
    @posts = Post.last(10)
  end

  # GET /posts/1 or /posts/1.json
  def show
    @post = Post
      .includes(:user, :category, stars: [:user], builds: [:scripts, :folders, files_attachment: :blob], comments: [:user])
      .with_rich_text_readme
      .friendly
      .find(params[:id])

    redirect_to :root, alert: "action not permitted" if @post.private_visibility? && @post.user != current_user

    @comments = @post.comments.order(:created_at)
  end

  # GET /posts/new
  def new
    @post = Post.new
  end

  # GET /posts/1/builds
  def builds
    @builds = @post.builds.order(created_at: :desc)
    @selected_build = @post.builds.find_by(id: params[:build_id]) if params[:build_id]
    redirect_to post_builds_path if @selected_build&.published == true
  end

  # GET /posts/1/edit
  def edit
  end

  # POST /posts or /posts.json
  def create
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

  def count_levels(parameters, attribute_key)
    return 0 if parameters[attribute_key].nil?

    parameters = parameters.to_unsafe_hash if parameters.instance_of? ActionController::Parameters
    parameters[attribute_key].map do |child_params|
      count_levels(child_params.to_a[1], attribute_key)
    end.max + 1
  end

  # Only allow a list of trusted parameters through.
  def post_params
    folder_attributes_base = [:id, :name, :_destroy, scripts_attributes: [:id, :name, :content, :_destroy]]
    folders = []

    if params[:post][:builds_attributes]
      depth = params[:post][:builds_attributes].to_unsafe_hash.map do |p|
        count_levels(p.to_a[1], "folders_attributes")
      end.max

      (1..depth).each do |value|
        folders = folder_attributes_base + [{folders_attributes: folders}]
      end
    end

    params.require(:post).permit(
      :title,
      :category_id,
      :summary,
      :readme,
      :visibility,
      {builds_attributes: [
        :id,
        :name,
        :_destroy,
        scripts_attributes: [:id, :name, :content, :_destroy],
        folders_attributes: folders
      ]}
    )
  end
end
