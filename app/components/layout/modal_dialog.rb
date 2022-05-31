# frozen_string_literal: true

class Layout::ModalDialog < ApplicationComponent
  renders_one :header, lambda { |**kwargs|
    kwargs[:tag] = :span
    kwargs[:class] = "mr-2 font-semibold #{kwargs[:small] ? "text-md" : "text-xl"}"

    Layout::BaseComponent.new(**kwargs)
  }

  renders_one :body, lambda { |**kwargs|
    kwargs[:class] = "text-left overflow-x-auto w-full py-5 px-3 bg-beaver-850 #{kwargs[:class]}"
    Layout::BaseComponent.new(**kwargs)
  }

  renders_one :footer, Layout::ModalDialog::Footer

  def initialize(tag: :div, size: :large, **sys_params)
    @sys_params = sys_params
    @tag = tag
    sizes = {small: 300, medium: 600, large: "1024"}

    sys_params[:class] = "mt-auto mb-auto mx-10 relative w-full "
    sys_params[:style] = "max-width: #{sizes[size] || size}px"
  end
end
