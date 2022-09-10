# frozen_string_literal: true

class Layout::Tabs < ApplicationComponent
  renders_many :tabs, lambda { |**kwargs|
    kwargs[:tag] ||= :a
    kwargs[:data] ||= {}
    kwargs[:data][:tabs_target] = "tab"
    kwargs[:data][:action] = "click->tabs#change"
    kwargs[:class] ||= "tab tab-lifted"

    Layout::BaseComponent.new(**kwargs)
  }

  renders_one :tabs_append

  renders_many :tab_contents, lambda { |**kwargs|
    kwargs[:tag] ||= :div
    kwargs[:data] ||= {}
    kwargs[:data][:tabs_target] = "panel"
    kwargs[:class] ||= "hidden border border-base-300"
    kwargs[:style] ||= "margin-top: -1px"

    Layout::BaseComponent.new(**kwargs)
  }

  def initialize(render_outside: false, active_tab_class: "", **sys_params)
    @render_outside = render_outside
    @sys_params = sys_params
    @sys_params[:data] ||= {}
    @sys_params[:data][:controller] = "tabs"
    @sys_params[:data][:tabs_active_tab] = active_tab_class
  end
end
