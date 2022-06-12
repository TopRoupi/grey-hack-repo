# frozen_string_literal: true

class Daisy::Form::GroupComponent < ViewComponent::Form::FieldComponent
  def initialize(form, object_name, method_name, &block)
    super(form, object_name, method_name, {}, &block)
  end
end
