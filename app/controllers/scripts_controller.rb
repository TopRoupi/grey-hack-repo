class ScriptsController < ApplicationController
  before_action :set_script, only: [:show]

  def show
  end

  private

  def set_script
    @script = Script.find(params[:id])
  end
end