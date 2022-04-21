class FoldersController < ApplicationController
  before_action :authenticate_user!, only: [:edit, :update]
  before_action :set_folder, only: [:show, :edit, :update]
  before_action :block_access, only: [:edit, :update]

  # GET /folders/1/edit
  def edit
  end

  # PUT /folders/1
  def update
    respond_to do |format|
      if @folder.update(folder_params)
        format.html { redirect_back fallback_location: root_path, notice: "Script was successfully updated." }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @folder.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_folder
    @folder = Folder.find(params[:id])
  end

  def block_access
    redirect_to :root, alert: "action not permitted" if @folder.user != current_user
  end

  def folder_params
    params.require(:folder).permit(:name)
  end
end
