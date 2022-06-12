# frozen_string_literal: true

class Daisy::Form::RichTextAreaComponent < ViewComponent::Form::RichTextAreaComponent
  def html_class
    class_names("textarea textarea-bordered w-full px-3 py-2 h-full trix-content", "textarea-error": method_errors?)
  end
end
