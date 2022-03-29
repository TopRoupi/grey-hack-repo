# frozen_string_literal: true

class Layout::NavBar::Notifications::Component < ApplicationComponent
  def initialize(current_user:)
    @current_user = current_user
    @notifications = @current_user.notifications.unread.map { |n| n.to_notification }
  end
end
