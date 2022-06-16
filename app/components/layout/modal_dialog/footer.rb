# frozen_string_literal: true

class Layout::ModalDialog::Footer < ApplicationComponent
  renders_many :actions, lambda { |**kwargs|
    Layout::ModalDialog::Footer::Actions.new(@modal_id, **kwargs)
  }

  def initialize(id, tag: :div, **sys_params)
    @modal_id = id
    @tag = tag
    @sys_params = sys_params
    @sys_params[:class] = "modal-action"
  end
end
