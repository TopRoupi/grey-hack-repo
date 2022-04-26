# frozen_string_literal: true

module SupporterSubscription
  def self.price
    Rails.application.credentials.dig(Rails.env.to_sym, :stripe, :price_ids, :supporter_plan)
  end

  def self.name
    "supporter plan year"
  end
end
