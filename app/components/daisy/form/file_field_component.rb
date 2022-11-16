# frozen_string_literal: true

class Daisy::Form::FileFieldComponent < ViewComponent::Form::FileFieldComponent
  def html_class
    class_names("file-input file-input-bordered w-full #{options[:class]}", "input-error": method_errors?)
  end
end
