# frozen_string_literal: true

class Layout::Dropdown::Component < ApplicationComponent
  renders_one :button, lambda { |**kwargs|
    kwargs[:data] ||= {}
    kwargs[:data][:action] = "click->dropdown#toggle click@window->dropdown#hide"
    kwargs[:data][:dropdown_target] = "button"

    Layout::BaseComponent.new(**kwargs)
  }

  renders_one :menu, Layout::Dropdown::Menu::Component

  def initialize(tag: "div", **sys_params)
    @sys_params = sys_params
    @tag = tag
    @sys_params[:data] ||= {}
    @sys_params[:data][:controller] = "dropdown"
    @sys_params[:class] ||= "inline-block leading-none relative"
  end
end
