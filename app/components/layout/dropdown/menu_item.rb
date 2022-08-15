# frozen_string_literal: true

class Layout::Dropdown::MenuItem < ApplicationComponent
  def initialize(tag: :span, type: nil, **sys_params)
    @sys_params = sys_params
    @tag = tag
    @item_class = case type
    when :title
      "menu-title"
    when :disabled
      "disabled"
    end
  end
end
