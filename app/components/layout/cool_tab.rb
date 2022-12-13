# frozen_string_literal: true

class Layout::CoolTab < ApplicationComponent
  renders_many :tabs, lambda { |**kwargs|
    kwargs[:data] ||= {}
    kwargs[:data][:tab_highlight_target] = "tabs"
    kwargs[:style] ||= "z-index: 1"

    Layout::BaseComponent.new(**kwargs)
  }

  renders_one :hightlight, lambda { |**kwargs|
    kwargs[:class] ||= ""
    kwargs[:class] += " opacity-0 absolute"

    kwargs[:data] ||= {}
    kwargs[:data][:tab_highlight_target] = "highlight"

    kwargs[:style] ||= "transition: 0.15s ease; transition-property: all; transition-property: opacity, width, left, top;"

    Layout::BaseComponent.new(**kwargs)
  }

  renders_one :append

  def initialize(tag: "div", **sys_params)
    @sys_params = sys_params
    @tag = tag
    @sys_params[:class] ||= "relative flex"
    @sys_params[:data] ||= {}
    @sys_params[:data][:controller] = "tab-highlight"

  end
end
