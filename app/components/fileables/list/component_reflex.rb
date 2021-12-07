# frozen_string_literal: true

class Fileables::List::ComponentReflex < ApplicationReflex
  before_reflex do
    session[:forms] ||= {}
    session[:forms]["Post"] ||= Post.new(controller.send(:post_params))
    @fileable = session[:forms]["Post"]
  end

  def add_script
    session[:forms]["Post"].scripts.build
    morph dom_id(@fileable, "fileable"), render(Fileables::List::Component.new(fileable: @fileable, edit: true))
  end
end
