# frozen_string_literal: true

class Layout::Toggle < ApplicationComponent
  def initialize(tag: :div, **sys_params)
    @sys_params = sys_params
    @tag = tag
    @sys_params[:data] ||= {}
    @sys_params[:data][:controller] = "toggle"
  end

  def toggle(**kwargs)
    kwargs[:data] ||= {}
    kwargs[:data][:action] = "click->toggle#toggle touch->toggle#toggle"
    Layout::BaseComponent.new(**kwargs)
  end

  def toggleable(**kwargs)
    kwargs[:data] ||= {}
    kwargs[:data][:toggle_target] = "toggleable"
    if kwargs[:class]
      kwargs[:class] += " hidden"
    else
      kwargs[:class] = "hidden"
    end
    Layout::BaseComponent.new(**kwargs)
  end
end
