# frozen_string_literal: true

class Layout::NavBar::Notifications::Component < ApplicationComponent
  def initialize(current_user:, invites: nil)
    @current_user = current_user
    @notifications = @current_user.notifications.unread.map { |n| n.to_notification }
    @invites = invites || Invite.where(user: @current_user, accepted_date: nil)
  end
end
