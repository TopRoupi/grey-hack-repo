# frozen_string_literal: true

class Daisy::Form::TextAreaComponent < ViewComponent::Form::TextAreaComponent
  def html_class
    class_names("textarea textarea-bordered w-full px-3 py-2 h-full", "textarea-error": method_errors?)
  end
end
