# frozen_string_literal: true

# Please do not make direct changes to this file!
# This generator is maintained by the community around simple_form-bootstrap:
# https://github.com/rafaelfranca/simple_form-bootstrap
# All future development, tests, and organization should happen there.
# Background history: https://github.com/heartcombo/simple_form/issues/1561

# Uncomment this and change the path if necessary to include your own
# components.
# See https://github.com/heartcombo/simple_form#custom-components
# to know more about custom components.
# Dir[Rails.root.join('lib/components/**/*.rb')].each { |f| require f }

# Use this setup block to configure all options available in SimpleForm.
SimpleForm.setup do |config|
  # Default class for buttons
  config.button_class = "text-white bg-indigo-700 rounded-md focus:bg-indigo-800 focus:outline-none py-2 px-5 cursor-pointer"

  # Define the default class of the input wrapper of the boolean input.
  config.boolean_label_class = "form-check-label"

  # How the label text should be generated altogether with the required text.
  config.label_text = lambda { |label, required, explicit_label| "#{label} #{required}" }

  # Define the way to render check boxes / radio buttons with labels.
  config.boolean_style = :inline

  # You can wrap each item in a collection of radio/check boxes with a tag
  config.item_wrapper_tag = :div

  # Defines if the default input wrapper class should be included in radio
  # collection wrappers.
  config.include_default_input_wrapper_class = false

  # CSS class to add for error notification helper.
  config.error_notification_class = "alert alert-danger"

  # Method used to tidy up errors. Specify any Rails Array method.
  # :first lists the first message for each field.
  # :to_sentence to list all errors for each field.
  config.error_method = :to_sentence

  # add validation classes to `input_field`
  config.input_field_error_class = "is-invalid"
  config.input_field_valid_class = "is-valid"

  # vertical forms
  #
  # vertical default_wrapper
  config.wrappers :vertical_form, tag: "div", class: "mb-6" do |b|
    b.use :html5
    b.use :placeholder
    b.optional :maxlength
    b.optional :minlength
    b.optional :pattern
    b.optional :min_max
    b.optional :readonly
    b.use :label, class: "block mb-2 text-sm text-chestnut-400"
    b.use :input, class: "w-full px-3 py-2 rounded-md focus:outline-none focus:ring bg-beaver-800 text-white placeholder-beaver-500 border-beaver-700 focus:ring-beaver-700 focus:border-beaver-700", error_class: "border-red-300", valid_class: "border-green-500"
    b.use :full_error, wrap_with: {tag: "div", class: "text-red-500 text-xs italic error"}
    b.use :hint, wrap_with: {tag: "small", class: "text-gray-500 text-xs italic"}
  end

  # vertical input for boolean
  config.wrappers :vertical_boolean, tag: "div", class: "flex text-gray-500 font-bold mb-6" do |b|
    b.use :html5
    b.optional :readonly
    b.use :input, class: "mr-2 leading-tight", error_class: "is-invalid", valid_class: "is-valid"
    b.use :label, class: "text-sm text-gray-400"
    b.use :full_error, wrap_with: {tag: "div", class: "invalid-feedback"}
    b.use :hint, wrap_with: {tag: "small", class: "form-text text-muted"}
  end

  # vertical input for radio buttons and check boxes
  config.wrappers :vertical_collection, item_wrapper_class: "form-check", item_label_class: "form-check-label", tag: "fieldset", class: "form-group", error_class: "form-group-invalid", valid_class: "form-group-valid" do |b|
    b.use :html5
    b.optional :readonly
    b.wrapper :legend_tag, tag: "legend", class: "col-form-label pt-0" do |ba|
      ba.use :label_text
    end
    b.use :input, class: "form-check-input", error_class: "is-invalid", valid_class: "is-valid"
    b.use :full_error, wrap_with: {tag: "div", class: "invalid-feedback d-block"}
    b.use :hint, wrap_with: {tag: "small", class: "form-text text-muted"}
  end

  # vertical input for inline radio buttons and check boxes
  config.wrappers :vertical_collection_inline, item_wrapper_class: "form-check form-check-inline", item_label_class: "form-check-label", tag: "fieldset", class: "form-group", error_class: "form-group-invalid", valid_class: "form-group-valid" do |b|
    b.use :html5
    b.optional :readonly
    b.wrapper :legend_tag, tag: "legend", class: "col-form-label pt-0" do |ba|
      ba.use :label_text
    end
    b.use :input, class: "form-check-input", error_class: "is-invalid", valid_class: "is-valid"
    b.use :full_error, wrap_with: {tag: "div", class: "invalid-feedback d-block"}
    b.use :hint, wrap_with: {tag: "small", class: "form-text text-muted"}
  end

  # vertical file input
  config.wrappers :vertical_file, tag: "div", class: "form-group", error_class: "form-group-invalid", valid_class: "form-group-valid" do |b|
    b.use :html5
    b.use :placeholder
    b.optional :maxlength
    b.optional :minlength
    b.optional :readonly
    b.use :label
    b.use :input, class: "form-control-file", error_class: "is-invalid", valid_class: "is-valid"
    b.use :full_error, wrap_with: {tag: "div", class: "invalid-feedback"}
    b.use :hint, wrap_with: {tag: "small", class: "form-text text-muted"}
  end

  # vertical multi select
  config.wrappers :vertical_multi_select, tag: "div", class: "form-group", error_class: "form-group-invalid", valid_class: "form-group-valid" do |b|
    b.use :html5
    b.optional :readonly
    b.use :label
    b.wrapper tag: "div", class: "d-flex flex-row justify-content-between align-items-center" do |ba|
      ba.use :input, class: "form-control mx-1", error_class: "is-invalid", valid_class: "is-valid"
    end
    b.use :full_error, wrap_with: {tag: "div", class: "invalid-feedback d-block"}
    b.use :hint, wrap_with: {tag: "small", class: "form-text text-muted"}
  end

  # vertical range input
  config.wrappers :vertical_range, tag: "div", class: "form-group", error_class: "form-group-invalid", valid_class: "form-group-valid" do |b|
    b.use :html5
    b.use :placeholder
    b.optional :readonly
    b.optional :step
    b.use :label
    b.use :input, class: "form-control-range", error_class: "is-invalid", valid_class: "is-valid"
    b.use :full_error, wrap_with: {tag: "div", class: "invalid-feedback d-block"}
    b.use :hint, wrap_with: {tag: "small", class: "form-text text-muted"}
  end

  # The default wrapper to be used by the FormBuilder.
  config.default_wrapper = :vertical_form

  config.wrapper_mappings = {
    boolean: :vertical_boolean,
    check_boxes: :vertical_collection,
    date: :vertical_multi_select,
    datetime: :vertical_multi_select,
    file: :vertical_file,
    radio_buttons: :vertical_collection,
    range: :vertical_range,
    time: :vertical_multi_select
  }
  # enable custom form wrappers
  # config.wrapper_mappings = {
  #   boolean:       :custom_boolean,
  #   check_boxes:   :custom_collection,
  #   date:          :custom_multi_select,
  #   datetime:      :custom_multi_select,
  #   file:          :custom_file,
  #   radio_buttons: :custom_collection,
  #   range:         :custom_range,
  #   time:          :custom_multi_select
  # }
end
