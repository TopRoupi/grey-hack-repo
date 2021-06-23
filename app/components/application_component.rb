# frozen_string_literal: true

class ApplicationComponent < ViewComponent::Base
  delegate :current_user, to: :helpers
  delegate :dom_id, to: :helpers
  delegate :octicon, to: :helpers
  include ApplicationHelper
  include Pagy::Backend
end
