# frozen_string_literal: true

class Daisy::Form::CheckBoxComponent < ViewComponent::Form::CheckBoxComponent
  def html_class
    class_names("checkbox checkbox-primary")
  end
end
