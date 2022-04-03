# frozen_string_literal: true

class Layout::Dropdown < ApplicationComponent
  renders_one :button, lambda { |**kwargs|
    if !@disabled
      kwargs[:data] ||= {}
      kwargs[:data][:action] = "click->dropdown#toggle click@window->dropdown#hide"
      kwargs[:data][:dropdown_target] = "button"
    end

    Layout::BaseComponent.new(**kwargs)
  }

  renders_one :menu, Layout::Dropdown::Menu

  def initialize(tag: "div", disabled: false, **sys_params)
    @sys_params = sys_params
    @tag = tag
    @disabled = disabled
    @sys_params[:data] ||= {}
    @sys_params[:data][:controller] = "dropdown"
    @sys_params[:class] ||= "inline-block relative"
  end
end
