# frozen_string_literal: true

class Posts::BuildsCard::FileableList::ComponentReflex < ApplicationReflex
  before_reflex :set_session_form
  before_reflex :set_index_table, only: [:edit_file, :remove_file, :add_folder_file]
  before_reflex :set_selected_file, only: [:edit_file, :remove_file, :add_folder_file]

  after_reflex do
    session[:forms][@form_key] = @post
  end

  def add_file
    type = element.dataset[:type]

    if type == "folder"
      @selected_build.folders.build
    else
      @selected_build.scripts.build
    end
  end

  def add_build
    @post.builds.build name: "build"
  end

  def remove_build
    @post.builds.delete @post.builds[element.dataset[:index].to_i]
  end

  def edit_build
    params[:edit_file] = @post.builds[element.dataset[:index].to_i]
  end

  def import_build(params)
    string = params["string"]
    name = params["name"]
    string = string.delete("\n")
    string = string.gsub("\\...n", "\\n")
    @post.builds << Build.parse_string(string, name)
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

  def add_folder_file
    type = element.dataset[:type]

    if type == "folder"
      @selected_file.folders.build
    else
      @selected_file.scripts.build
    end
  end

  def close_form
  end

  def update
  end

  private

  def set_session_form
    session[:forms] ||= {}

    if params[:action] == "edit"
      @form_key = "Post_#{params[:id]}"
      post = Post.friendly.find(params[:id])
      post.attributes = controller.send(:post_params)
      session[:forms][@form_key] = post
    else
      @form_key = "Post"
      session[:forms][@form_key] = Post.new(controller.send(:post_params))
    end

    @post = session[:forms][@form_key]
    @selected_build_index = session[:selected_build]
    @selected_build = @post.builds[@selected_build_index]
  end

  def set_index_table
    @index_table = @selected_build.children_index_table

    index = element.dataset[:index]
    @parent, @index = index.split("_")
    @parent = @parent.to_i
    @index = @index.to_i
  end

  def set_selected_file
    @selected_file = @index_table[@index]
    @selected_parent = @index_table[@parent]
  end
end
