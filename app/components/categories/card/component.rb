# frozen_string_literal: true

class Categories::Card::Component < ApplicationComponent
  def initialize(category:, link:, on_grid: false, small: false, active: false)
    @category = category
    @link = link
    @ongrid = on_grid
    @small = small
    @active = active

    if category == :all
      @name = "All"
      @icon = "pencil"
    else
      @name = category.name
      @icon = category.icon
    end
  end
end
