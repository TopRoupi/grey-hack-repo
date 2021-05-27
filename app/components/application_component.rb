# frozen_string_literal: true

class ApplicationComponent < ViewComponent::Base
  delegate :current_user, to: :helpers
  delegate :dom_id, to: :helpers
  include ApplicationHelper
end
