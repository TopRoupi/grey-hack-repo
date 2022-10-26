# frozen_string_literal: true

class ApplicationController < ActionController::Base
  include Pagy::Backend
  include CableReady::Broadcaster
  default_form_builder DaisyFormBuilder
  Pagy::DEFAULT[:items] = 10

  include Pundit::Authorization
  # after_action :verify_authorized, except: :index
  # after_action :verify_policy_scoped, only: :index
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized
  rescue_from Pundit::AuthorizationNotPerformedError, with: :user_not_logged

  before_action :configure_permitted_parameters, if: :devise_controller?
  newrelic_ignore_enduser

  def render_not_found
    render file: "public/404.html", status: 404, layout: false
  end

  private

  def user_not_authorized(exception)
    redirect_to :root, alert: "action not permitted"
  end

  def user_not_logged
    redirect_to :root
  end

  protected

  def configure_permitted_parameters
    devise_parameter_sanitizer.permit(:sign_up, keys: [:name, :email])
    devise_parameter_sanitizer.permit(:sign_in, keys: [:name])
    devise_parameter_sanitizer.permit(:account_update, keys: [:name, :btc, :bank, :email, :avatar, :banner])
  end
end
