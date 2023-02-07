# frozen_string_literal: true

class Daisy::Form::GroupComponent < ViewComponent::Form::FieldComponent
  def initialize(form, object_name, method_name, options = {}, &block)
    @hint = options[:hint]
    @required = options[:required]
    @label = options[:label]
    @class = options[:class]
    @labelless = options[:labelless]

    super(form, object_name, method_name, {}, &block)
  end

  def labelless?
    !@labelless.nil?
  end

  def required?
    return @required if @required.nil? == false
    super()
  end

  def label
    @label || method_name.capitalize
  end
end
