# frozen_string_literal: true

class RichTextAreaInput < SimpleForm::Inputs::Base
  def input_html_classes
    super.push("trix-content")
  end

  def input(wrapper_options = nil)
    merged_input_options = merge_wrapper_options(input_html_options, wrapper_options)

    @builder.rich_text_area(attribute_name, merged_input_options)
  end
end
