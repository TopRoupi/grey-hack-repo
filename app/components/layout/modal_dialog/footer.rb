# frozen_string_literal: true

class Layout::ModalDialog::Footer < ApplicationComponent
  renders_many :actions, "Layout::ModalDialog::Footer::Actions"

  class Layout::ModalDialog::Footer::Actions < Layout::BaseComponent
    def initialize(tag: :button, close: false, style: :secondary, **sys_params)
      @tag = tag
      @sys_params = sys_params
      @sys_params[:class] = "button_#{style} p-2 rounded"
      if close
        @sys_params[:data] = {}
        @sys_params[:data][:action] = "click->modal#close"
      end
    end
  end

  def initialize(tag: :div, **sys_params)
    @tag = tag
    @sys_params = sys_params
    @sys_params[:class] = "flex justify-end items-center gap-2 flex-wrap p-2 rounded-b bg-beaver-900"
  end
end
