# frozen_string_literal: true

class BuildsController < ApplicationController
  before_action :authenticate_user!, except: [:diff]
  before_action :set_build, only: [:destroy, :publish, :diff]
  before_action :block_access, only: [:publish, :destroy]

  # POST /builds/1/publish
  def publish
    @build.update published: true
    redirect_to post_builds_path(@build.post)
  end

  # DELETE /builds/1
  def destroy
    @build.destroy
    respond_to do |format|
      format.html { redirect_back fallback_location: root_path, status: :see_other, notice: "Build was successfully destroyed." }
    end
  end

  def diff
    where_options = {post: @build.post, created_at: (nil..@build.created_at)}

    if params[:unpublished]
      redirect_to :root, alert: "action not permitted" if @build.post.user != current_user
    elsif @build.published? == false || @build.post.private_visibility? && @build.post.user != current_user
      redirect_to :root, alert: "action not permitted"
      where_options[:published] = true
    end

    @builds = Build.where(where_options).order(created_at: :desc).limit(2)

    @before = @builds[1]
    @after = @builds[0]
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_build
    @build = Build.find(params[:id])
  end

  def block_access
    if current_user != @build.post.user
      redirect_to :root, alert: "action not permitted"
    end
  end

  # Only allow a list of trusted parameters through.
  def build_params
    params.require(:build).permit(:name)
  end
end
