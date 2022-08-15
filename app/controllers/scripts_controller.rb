# frozen_string_literal: true

class ScriptsController < ApplicationController
  before_action :authenticate_user!, only: [:edit, :update]
  before_action :set_script, only: [:show, :edit, :update]
  before_action :block_access, only: [:edit, :update]

  # GET /scripts/1
  def show
  end

  # GET /scripts/1/edit
  def edit
  end

  # PUT /scripts/1
  def update
    respond_to do |format|
      if @script.update(script_params)
        format.html { render "scripts/_form", locals: {script: @script, message: "Script updated"} }
        Broadcast::File.morph(file: @script)
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @script.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def set_script
    @script = Script.find(params[:id])
  end

  def block_access
    redirect_to :root, alert: "action not permitted" if @script.user != current_user
  end

  def script_params
    params.require(:script).permit(:name, :content)
  end
end
