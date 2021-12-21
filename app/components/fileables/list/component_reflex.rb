# frozen_string_literal: true

class Fileables::List::ComponentReflex < ApplicationReflex
  before_reflex do
    puts "aaaaaaaaaaaaaaaaaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    puts params
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
    index = element.dataset[:index]
    type, index = index.split("_")
    index = index.to_i

    case type
    when "script"
      params[:edit_file] = @fileable.scripts[index]
    when "folder"
      params[:edit_file] = @fileable.folders[index]
    end
  end

  def remove_file
    index = element.dataset[:index]
    type, index = index.split("_")
    index = index.to_i

    case type
    when "script"
      removed_script = @fileable.scripts[index]
      @fileable.scripts.delete(removed_script)
    when "folder"
      removed_folder = @fileable.folders[index]
      @fileable.folders.delete(removed_folder)
    end
  end

  def add_folder_script
    index = element.dataset[:index]
    index = index.split("_")[1]
    index = index.to_i

    @fileable.folders[index].scripts.build
  end

  def close_form
  end

  def update
  end
end
