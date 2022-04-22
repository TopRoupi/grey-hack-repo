class CheckoutsController < ApplicationController
  before_action :authenticate_user!, only: [:get_supporter]

  def get_supporter
    current_user.set_payment_processor :stripe

    @checkout_session = current_user.payment_processor.checkout(
      mode: "payment",
      line_items: "price_1KqRBADSSkrqq2dHZzJmdXdI"
    )
  end
end
