# frozen_string_literal: true

class Stars::Badge::Component < ApplicationComponent
  def initialize(starable:, transparent: false, visual: false)
    @starable = starable
    @stars = @starable.stars
    @transparent = transparent
    @visual = visual
  end

  def stared?
    if current_user
      current_user.stars.where(starable: @starable).count == 1
    else
      false
    end
  end
end
