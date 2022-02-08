# frozen_string_literal: true

class Layout::NavBar::Notifications::Component < ApplicationComponent
  def initialize(user:)
    @user = user
    @notifications = @user.notifications.unread.map { |n| n.to_notification }
  end
end
