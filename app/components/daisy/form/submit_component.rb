# frozen_string_literal: true

class Daisy::Form::SubmitComponent < ViewComponent::Form::SubmitComponent
  def html_class
    class_names("btn btn-primary float-right")
  end
end
