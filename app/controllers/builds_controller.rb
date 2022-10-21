# frozen_string_literal: true

class BuildsController < ApplicationController
  before_action :authenticate_user!, except: [:diff]
  before_action :set_build, only: [:destroy, :publish, :diff]

  # POST /builds/1/publish
  def publish
    authorize @build

    @build.update published: true
    redirect_to post_builds_path(@build.post)

    DiscordJob.perform_later(@build)
  end

  # DELETE /builds/1
  def destroy
    authorize @build

    @build.destroy
    respond_to do |format|
      format.html { redirect_back fallback_location: root_path, status: :see_other, notice: "Build was successfully destroyed." }
    end
  end

  def diff
    authorize @build

    where_options = {post: @build.post, created_at: (nil..@build.created_at)}
    if !params[:unpublished]
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

  # Only allow a list of trusted parameters through.
  def build_params
    params.require(:build).permit(:name)
  end
end
