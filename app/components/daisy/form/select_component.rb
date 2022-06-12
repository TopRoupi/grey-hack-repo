# frozen_string_literal: true

class Daisy::Form::SelectComponent < ViewComponent::Form::SelectComponent
  def html_class
    class_names("select select-bordered w-full px-3 py-2 h-full", "select-error": method_errors?)
  end
end
