# frozen_string_literal: true

class Daisy::Form::RangeFieldComponent < ViewComponent::Form::RangeFieldComponent
  def html_class
    class_names("range w-full", "input-error": method_errors?)
  end
end
