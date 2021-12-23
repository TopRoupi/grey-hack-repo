# frozen_string_literal: true

class Fileables::List::ComponentReflex < ApplicationReflex
  before_reflex :set_session_form
  before_reflex :set_index_table, only: [:edit_file, :remove_file, :add_folder_script, :add_folder_folder]

  after_reflex do
    session[:forms][@form] = @fileable
  end

  def add_script
    @fileable.scripts.build
  end

  def add_folder
    @fileable.folders.build
  end

  def edit_file
    params[:edit_file] = @selected_file
  end

  def remove_file
    case @selected_file.class.to_s
    when "Script"
      @selected_parent.scripts.delete(@selected_file)
    when "Folder"
      @selected_parent.folders.delete(@selected_file)
    end
  end

  def add_folder_script
    @selected_file.scripts.build
  end

  def add_folder_folder
    @selected_file.folders.build
  end

  def update
  end

  private

  def set_session_form
    session[:forms] ||= {}

    if params[:action] == "edit"
      @form = "Post_#{params[:id]}"
      post = Post.find(params[:id])
      post.attributes = controller.send(:post_params)
      session[:forms][@form] = post
    else
      @form = "Post"
      session[:forms][@form] = Post.new(controller.send(:post_params))
    end

    @fileable = session[:forms][@form]
  end

  def set_index_table
    @index_table = @fileable.children_index_table

    index = element.dataset[:index]
    @parent, @index = index.split("_")
    @parent = @parent.to_i
    @index = @index.to_i

    @selected_file = @index_table[@index]
    @selected_parent = @index_table[@parent]
  end
end
