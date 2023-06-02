# frozen_string_literal: true

class BuildsController < ApplicationController
  before_action :authenticate_user!, except: [:diff]
  before_action :set_build, only: [:destroy, :publish, :diff]

  # PATCH /builds/1/publish
  def publish
    authorize @build

    build_params = params.require(:build).permit(:message)
    build_params[:published] = true

    if @build.update(build_params)
      redirect_to post_builds_path(@build.post), notice: "Build #{@build.name} published"
      DiscordJob.perform_later(@build)
    else
      render "builds/_publish_form", locals: {build: @build}
    end
  end

  # DELETE /builds/1
  def destroy
    authorize @build

    @build.destroy
    respond_to do |format|
      format.html { redirect_to post_builds_path(@build.post), status: :see_other, notice: "Build was successfully destroyed." }
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
