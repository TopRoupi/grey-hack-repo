# frozen_string_literal: true

class Layout::ModalDialog < ApplicationComponent
  renders_one :header, lambda { |**kwargs|
    kwargs[:tag] = :span
    kwargs[:class] = "mr-2 font-bold #{kwargs[:small] ? "text-md" : "text-lg"}"

    Layout::BaseComponent.new(**kwargs)
  }

  renders_one :body, lambda { |**kwargs|
    kwargs[:class] = "text-left overflow-x-auto w-full pt-4 #{kwargs[:class]}"
    Layout::BaseComponent.new(**kwargs)
  }

  renders_one :footer, lambda { |**kwargs|
    Layout::ModalDialog::Footer.new(@modal_id, **kwargs)
  }

  def initialize(id, tag: :label, size: :large, **sys_params)
    @modal_id = id
    @sys_params = sys_params
    @tag = tag
    sizes = {small: 300, medium: 600, large: "1024"}

    sys_params[:class] = "modal-box relative w-full"
    sys_params[:style] = "max-width: #{sizes[size] || size}px"
  end
end
