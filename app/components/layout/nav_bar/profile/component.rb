# frozen_string_literal: true

class Layout::NavBar::Profile::Component < ApplicationComponent
  def initialize(current_user:)
    @current_user = current_user
  end
end
