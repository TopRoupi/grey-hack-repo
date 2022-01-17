# frozen_string_literal: true

class AlertReflex < ApplicationReflex
  def alert
    message = element.dataset[:message]
    type = element.dataset[:type] || "info"

    send_alert(message, type.to_sym)
  end
end
