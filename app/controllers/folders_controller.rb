# frozen_string_literal: true

class FoldersController < ApplicationController
  before_action :authenticate_user!, only: [:edit, :update]
  before_action :set_folder, only: [:show, :edit, :update]

  # GET /folders/1/edit
  def edit
    authorize @folder
  end

  # PUT /folders/1
  def update
    authorize @folder

    respond_to do |format|
      if @folder.update(folder_params)
        format.html { render "folders/_form", locals: {folder: @folder, message: "Folder updated"} }
        Broadcast::File.morph(file: @folder)
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

  def folder_params
    params.require(:folder).permit(:name)
  end
end
