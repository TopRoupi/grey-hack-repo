# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pagy::Backend
  default_form_builder DaisyFormBuilder
  Pagy::DEFAULT[:items] = 10

  before_action :configure_permitted_parameters, if: :devise_controller?
  newrelic_ignore_enduser

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :email])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :btc, :bank, :email, :avatar])
  end
end
