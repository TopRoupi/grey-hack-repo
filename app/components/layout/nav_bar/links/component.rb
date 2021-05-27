# frozen_string_literal: true

class Layout::NavBar::Links::Component < ApplicationComponent
  def initialize(mobile: false)
    @mobile = mobile
  end
end
