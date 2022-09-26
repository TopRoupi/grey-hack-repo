# frozen_string_literal: true

class Layout::Dropdown < ApplicationComponent
  renders_one :button, lambda { |**kwargs|
    Layout::BaseComponent.new(**kwargs)
  }

  renders_one :menu, Layout::Dropdown::Menu

  def initialize(tag: "div", direction: :right, **sys_params)
    @sys_params = sys_params
    @tag = tag
    @sys_params[:class] ||= ""
    @sys_params[:class] += " dropdown #{"dropdown-end" if direction == :left}"
  end
end
