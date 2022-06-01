# frozen_string_literal: true

class BuildsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_build, only: [:destroy, :publish]

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

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_build
    @build = Build.find(params[:id])
    redirect_to :root, alert: "action not permitted" if @build.post.user != current_user
  end

  # Only allow a list of trusted parameters through.
  def build_params
    params.require(:build).permit(:name)
  end
end
