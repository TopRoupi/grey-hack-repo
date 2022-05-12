# frozen_string_literal: true

class CheckoutsController < ApplicationController
  before_action :authenticate_user!, only: [:get_supporter]

  def get_supporter
    current_user.set_payment_processor :stripe

    @checkout_session = current_user.payment_processor.checkout(
      line_items: SupporterBadge.price
    )
  end
end
