# frozen_string_literal: true

class Layout::Dropdown::Menu < ApplicationComponent
  renders_many :items, Layout::Dropdown::MenuItem

  def initialize(tag: nil, compact: false, card: false, **sys_params)
    @sys_params = sys_params
    @tag ||= card ? :div : :ul
    classes = ""
    classes += "menu-compact " if compact && !card
    classes += "card " if card
    classes += "card-compact " if compact && card
    @sys_params[:tabindex] = 0
    @sys_params[:class] = "dropdown-content menu p-2 shadow bg-base-200 rounded-box w-52 #{classes} #{@sys_params[:class]}"
  end
end
