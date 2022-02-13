# frozen_string_literal: true

class Layout::Dropdown::Menu::Item::Component < ApplicationComponent
  include ViewComponent::PolymorphicSlots

  def initialize(tag: "div", type: :link, **sys_params)
    @sys_params = sys_params
    @tag = tag
    klass = case type
    when :link
      "block px-4 w-full text-left py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
    when :separator
      "block w-full border-b my-1"
    when :header
      "cursor-default block text-center px-4 py-2 text-sm text-gray-700 select-none"
    end
    sys_params[:class] = "#{klass} #{sys_params[:class]}"
  end
end
