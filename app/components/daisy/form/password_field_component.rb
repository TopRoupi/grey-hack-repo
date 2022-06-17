# frozen_string_literal: true

class Daisy::Form::PasswordFieldComponent < ViewComponent::Form::PasswordFieldComponent
  def html_class
    class_names("input input-bordered w-full px-3 py-2 h-full", "input-error": method_errors?)
  end
end
