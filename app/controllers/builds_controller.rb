class BuildsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_build, only: [:edit, :update, :destroy]

  # POST /builds
  def create
    @build = Build.new(build_params)
    @build.user = current_user

    respond_to do |format|
      if @build.save
        format.html { redirect_to @build.post, notice: "Post was successfully created." }
        format.json { render :show, status: :created, location: @build }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @build.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /builds/1
  def update
    respond_to do |format|
      if @build.update(build_params)
        format.html { redirect_back fallback_location: root_path, notice: "Build was successfully updated." }
      else
        format.json { render json: @build.errors, status: :unprocessable_entity }
        format.turbo_stream { render turbo_stream: turbo_stream.replace("edit_build_#{@build.id}", partial: "builds/form", locals: {build: @build}) }
      end
    end
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
