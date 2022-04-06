# frozen_string_literal: true

class FileableExplorer::File < ApplicationComponent
  def initialize(file:, tag: :button, **sys_params)
    @file = file
    @sys_params = sys_params
    @tag = tag

    if script?
      @icon = "file"
      @icon_color = "beaver-200"
    else # folder
      @icon = "file-directory-fill"
      @icon_color = "blue-400"
      @sys_params[:data] = {}
      @sys_params[:data][:reflex] = "click->FileableExplorerReflex#open"
      @sys_params[:data][:fileable_id] = @file.id
      @sys_params[:data][:fileable_type] = @file.class.to_s
    end

    @sys_params[:class] = "text-#{@icon_color} hover:bg-beaver-800 rounded flex flex-col justify-center items-center"
  end

  def script?
    @file.instance_of? Script
  end

  def folder?
    @file.instance_of? Folder
  end
end
