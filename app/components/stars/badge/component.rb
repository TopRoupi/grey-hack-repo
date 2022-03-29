# frozen_string_literal: true

class Stars::Badge::Component < ApplicationComponent
  def initialize(starable:, user:, transparent: false, visual: false)
    @starable = starable
    @stars = @starable.stars
    @transparent = transparent
    @visual = visual
    @user = user
  end

  def stared?
    if @user
      @stars.any? { |s| s.user == @user }
    else
      false
    end
  end
end
