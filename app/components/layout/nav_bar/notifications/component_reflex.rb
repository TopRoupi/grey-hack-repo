# frozen_string_literal: true

class Layout::NavBar::Notifications::ComponentReflex < ApplicationReflex
  def dismiss
    notification = current_user.notifications.unread.find(element.dataset[:id].to_i)
    notification.mark_as_read!
  end

  def dismiss_all
    current_user.notifications.unread.mark_as_read!
  end
end
