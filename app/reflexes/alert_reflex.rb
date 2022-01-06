# frozen_string_literal: true

class AlertReflex < ApplicationReflex
  def alert
    message = element.dataset[:message]
    type = element.dataset[:type] || "info"
    return unless message
    morph("#flash-messages", render(Layout::Alert::Component.new(message, type: type.to_sym)))
  end
end
