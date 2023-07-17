# frozen_string_literal: true

class StarsBadge < ApplicationComponent
  def initialize(starable:, user: nil, transparent: false, visual: false)
    @starable = starable
    @stars = @starable.stars
    @transparent = transparent
    @visual = visual
    @user = user
  end

  def stars_ids
    @starable.stars.pluck(:id)
  end

  def stared?
    if @user
      @stars.any? { |s| s.user == @user }
    else
      false
    end
  end
end
