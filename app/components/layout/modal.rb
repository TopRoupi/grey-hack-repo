# frozen_string_literal: true

class Layout::Modal < ApplicationComponent
  renders_one :button, lambda { |**kwargs|
    kwargs[:tag] = :label
    kwargs[:for] = @modal_id if !@disabled
    kwargs[:class] ||= "btn btn-modal"

    Layout::BaseComponent.new(**kwargs)
  }

  renders_one :dialog, lambda { |**kwargs|
    Layout::ModalDialog.new(@modal_id, **kwargs)
  }

  def initialize(tag: "div", disabled: false, **sys_params)
    @modal_id = "modal-#{Random.rand(999999)}"
    @sys_params = sys_params
    @tag = tag
    @disabled = disabled
  end
end
