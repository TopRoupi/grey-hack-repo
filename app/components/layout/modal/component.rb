# frozen_string_literal: true

class Layout::Modal::Component < ApplicationComponent
  renders_one :button, lambda { |**kwargs|
    unless @disabled
      kwargs[:data] ||= {}
      kwargs[:data][:action] = "click->modal#open"
    end

    Layout::BaseComponent.new(**kwargs)
  }

  renders_one :body, lambda { |**kwargs|
    Layout::BaseComponent.new(**kwargs)
  }

  def initialize(tag: "div", disabled: false, **sys_params)
    @sys_params = sys_params
    @tag = tag
    @disabled = disabled
    sys_params[:data] ||= {}
    sys_params[:data][:controller] = "modal"
    sys_params[:data][:modal_allow_background_close] = "true"
  end
end
