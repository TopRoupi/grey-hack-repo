# frozen_string_literal: true

class ApplicationReflex < StimulusReflex::Reflex
  delegate :current_user, to: :connection

  def send_alert(message = nil, type = :info)
    morph("#flash-messages", render(Layout::Alert::Component.new(message, type: type)))
  end
end
