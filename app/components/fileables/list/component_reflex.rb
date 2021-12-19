# frozen_string_literal: true

class Fileables::List::ComponentReflex < ApplicationReflex
  before_reflex do
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

  def edit_file
    index = element.dataset[:index].to_i
    params[:edit_file] = @fileable.scripts[index]
  end

  def remove_file
    index = element.dataset[:index].to_i
    removed_script = @fileable.scripts[index]
    @fileable.scripts.delete(removed_script)
  end

  def close_form
  end

  def update
  end
end
