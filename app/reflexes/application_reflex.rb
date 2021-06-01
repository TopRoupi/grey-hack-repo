# frozen_string_literal: true

class ApplicationReflex < StimulusReflex::Reflex
  class Connection < ActionCable::Connection::Base
    identified_by :current_user
    identified_by :session_id

    def connect
      self.current_user = env["warden"].user
      self.session_id = request.session.id
      reject_unauthorized_connection unless self.current_user || self.session_id
    end
  end
  # Put application-wide Reflex behavior and callbacks in this file.
  #
  # Example:
  #
  #   # If your ActionCable connection is: `identified_by :current_user`
  #   delegate :current_user, to: :connection
  #
  # Learn more at: https://docs.stimulusreflex.com/reflexes#reflex-classes
end
