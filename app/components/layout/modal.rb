# frozen_string_literal: true

class Layout::Modal < ApplicationComponent
  renders_one :button, lambda { |**kwargs|
    kwargs[:tag] ||= :button
    if !@disabled
      kwargs[:data] ||= {}
      kwargs[:data][:action] = "click->modal#open"
    end

    Layout::BaseComponent.new(**kwargs)
  }

  renders_one :dialog, Layout::ModalDialog

  def initialize(tag: "div", auto_open: false, disabled: false, **sys_params)
    @sys_params = sys_params
    @tag = tag
    @disabled = disabled
    sys_params[:data] ||= {}
    sys_params[:data][:controller] = "modal"
    sys_params[:data][:modal_auto_open_value] = "true" if auto_open
    sys_params[:data][:modal_allow_background_close] = "true"
  end
end
