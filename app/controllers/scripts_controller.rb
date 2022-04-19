# frozen_string_literal: true

class ScriptsController < ApplicationController
  before_action :set_script, only: [:show]

  def show
  end

  def new
    @script = Script.new
  end

  private

  def set_script
    @script = Script.find(params[:id])
  end
end
