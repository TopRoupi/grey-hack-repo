# frozen_string_literal: true

class Categories::Card::Component < ApplicationComponent
  def initialize(category:, tag: :a, small: false, active: false, style: nil, **sys_params)
    @style, @active_style = style || ["bg-gradient-to-r from-beaver-800 to-beaver-850", "bg-beaver-850"]
    @small = small
    @sys_params = sys_params
    @tag = tag
    @sys_params[:data] ||= {}
    @sys_params[:data][:controller] = "categories--card--component"
    @sys_params[:class] = "my-2 mx-2 #{active ? @active_style : @style} #{@small ? "!mx-0 py-2 justify-start md:pl-3" : "py-4 justify-center"} rounded-lg w-full flex flex-col hover:text-white text-beaver-300 md:flex-row items-center"
    @category = category

    if category == :all
      @name = "All"
      @icon = "pencil"
    else
      @name = category.name
      @icon = category.icon
    end
  end
end
