# frozen_string_literal: true

class Layout::Toggle < ApplicationComponent
  def initialize(tag: :div, open: false, disabled: false, **sys_params)
    @sys_params = sys_params
    @open = open
    @disabled = disabled
    @tag = tag
    @sys_params[:data] ||= {}
    @sys_params[:data][:controller] = "toggle"
  end

  def toggle(**kwargs)
    if @disabled == false
      kwargs[:data] ||= {}
      kwargs[:data][:action] = "click->toggle#toggle touch->toggle#toggle"
    end

    Layout::BaseComponent.new(**kwargs)
  end

  def toggleable(**kwargs)
    if @disabled == false
      kwargs[:data] ||= {}
      kwargs[:data][:toggle_target] = "toggleable"
    end
    if @open == false
      kwargs[:class] ||= "hidden"
      kwargs[:class] += " hidden" if kwargs[:class].index("hidden").nil?
    end

    Layout::BaseComponent.new(**kwargs)
  end
end
