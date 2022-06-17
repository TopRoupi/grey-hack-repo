# frozen_string_literal: true

class DaisyFormBuilder < ViewComponent::Form::Builder
  namespace "Daisy::Form"

  def group(method, **options, &block)
    render_component(:group, @object_name, method, options) do
      block.call
    end
  end
end
