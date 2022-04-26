# frozen_string_literal: true

Pay.setup do |config|
  # For use in the receipt/refund/renewal mailers
  config.business_name = "Business Name"
  config.business_address = "1600 Pennsylvania Avenue NW"
  config.application_name = "Greyrepo"
  config.support_email = "support@greyrepo.xyz"

  config.default_product_name = "supporter plan"
  # config.default_plan_name = "default"
end
