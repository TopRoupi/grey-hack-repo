# frozen_string_literal: true

class Layout::Dropdown::Menu::Component < ApplicationComponent
  renders_many :items, Layout::Dropdown::Menu::Item::Component

  def initialize(tag: "div", direction: :right, **sys_params)
    @sys_params = sys_params
    @tag = tag

    @sys_params[:data] ||= {}
    @sys_params[:data][:dropdown_target] = "menu"
    direction = direction.to_sym == :left ? "right-0" : "left-0"
    @sys_params[:class] ||= "absolute #{direction} mt-2 hidden z-50 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
    sys_params[:class] += " #{sys_params[:add_class]}" if sys_params[:add_class]
  end
end
