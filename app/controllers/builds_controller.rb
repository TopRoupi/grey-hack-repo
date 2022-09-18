# frozen_string_literal: true

class BuildsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_build, only: [:destroy, :publish, :diff]

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
    @builds = Build.where(post: @build.post, created_at: (nil..@build.created_at)).order(created_at: :desc).limit(2)

    @before = @builds[1]
    @after = @builds[0]

    before_files = @before.get_all_scripts.map do |script|
      key = script.scriptable.path_list.map(&:path)[1..].join("/")
      key += "/#{script.name}"
      [key, script]
    end.to_h

    after_files = @after.get_all_scripts.map do |script|
      key = script.scriptable.path_list.map(&:path)[1..].join("/")
      key += "/#{script.name}"
      [key, script]
    end.to_h

    @changed_files = []
    before_files.each do |key, value|
      next if after_files[key].nil?
      next if after_files[key].content == value.content

      @changed_files << [value, after_files[key]]
    end

    @added_files = []
    after_files.each do |key, value|
      next if before_files[key].nil? == false

      @added_files << [nil, value]
    end

    @deleted_files = []
    before_files.each do |key, value|
      next if after_files[key].nil? == false

      @deleted_files << [value, nil]
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
