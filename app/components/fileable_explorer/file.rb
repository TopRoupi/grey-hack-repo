# frozen_string_literal: true

class FileableExplorer::File < ApplicationComponent
  def initialize(file:, tag: nil, **sys_params)
    @file = file
    @sys_params = sys_params

    if script?
      @icon = "file"
      @icon_color = "beaver-200"
      @tag ||= :a
    else # folder
      @icon = "file-directory-fill"
      @icon_color = "blue-400"
      @tag ||= :button
      @sys_params[:data] = {}
      @sys_params[:data][:reflex] = "click->FileableExplorerReflex#open"
      @sys_params[:data][:fileable_id] = @file.id
      @sys_params[:data][:fileable_type] = @file.class.to_s
    end

    @sys_params[:class] = "text-#{@icon_color} hover:bg-base-200 rounded flex flex-col justify-center items-center"
  end

  def before_render
    @sys_params[:href] = script_path(@file) if script?
  end

  def script?
    @file.instance_of? Script
  end

  def folder?
    @file.instance_of? Folder
  end
end
