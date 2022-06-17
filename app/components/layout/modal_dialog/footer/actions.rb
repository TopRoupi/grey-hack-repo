# frozen_string_literal: true

class Layout::ModalDialog::Footer::Actions < Layout::BaseComponent
  def initialize(id, tag: :button, close: false, style: :secondary, **sys_params)
    @modal_id = id
    @tag = tag
    @sys_params = sys_params
    @sys_params[:class] = "btn btn-#{style}"
    if close
      @tag = :label
      @sys_params[:for] = @modal_id
    end
  end
end
