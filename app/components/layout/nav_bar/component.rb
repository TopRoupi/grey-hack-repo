# frozen_string_literal: true

class Layout::NavBar::Component < ApplicationComponent
  def initialize(current_user:)
    @current_user = current_user
  end
end
