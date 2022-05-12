# frozen_string_literal: true

module SupporterBadge
  def self.price
    Rails.application.credentials.dig(Rails.env.to_sym, :stripe, :price_ids, :supporter_badge)
  end

  def self.name
    "supporter badge"
  end
end
