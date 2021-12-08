# frozen_string_literal: true

class Fileables::List::ComponentReflex < ApplicationReflex
  before_reflex do
    session[:forms] ||= {}
    session[:forms]["Post"] ||= Post.new(controller.send(:post_params))
    @fileable = session[:forms]["Post"]
  end

  after_reflex do
    session[:forms]["Post"] = @fileable
    morph dom_id(@fileable, "fileable"), render(Fileables::List::Component.new(fileable: @fileable, edit: true))
  end

  def add_script
    @fileable.scripts.build
  end

  def remove_script
    index = element.dataset[:index].to_i
    removed_script = @fileable.scripts[index]
    @fileable.scripts.delete(removed_script)
  end
end
