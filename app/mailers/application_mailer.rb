# frozen_string_literal: true

class ApplicationMailer < ActionMailer::Base
  default from: "support@greyrepo.xyz"
  layout "mailer"
end
