# frozen_string_literal: true

class Daisy::Form::TextFieldComponent < ViewComponent::Form::TextFieldComponent
  def html_class
    class_names("input w-full px-3 py-2 h-full input-bordered #{options[:class]}", "input-error": method_errors?)
  end
end
