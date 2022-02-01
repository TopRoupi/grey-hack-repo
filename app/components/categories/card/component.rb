# frozen_string_literal: true

class Categories::Card::Component < ApplicationComponent
  def initialize(category:, link:, on_grid: false, small: false, active: false, style: nil)
    @category = category
    @link = link
    @ongrid = on_grid
    @small = small
    @active = active
    @style, @active_style = style || ["bg-gradient-to-r from-beaver-800 to-beaver-850", "bg-beaver-850"]

    if category == :all
      @name = "All"
      @icon = "pencil"
    else
      @name = category.name
      @icon = category.icon
    end
  end
end
