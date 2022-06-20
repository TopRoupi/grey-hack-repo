# frozen_string_literal: true

class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def github
    if current_user
      @user = current_user.link_github(request.env["omniauth.auth"])
      if @user
        redirect_back fallback_location: root_path, notice: "Github account linked"
      else
        redirect_back fallback_location: root_path, alert: "Github account already taken"
      end
      return
    end

    @user = User.from_omniauth(request.env["omniauth.auth"])
    if @user.persisted?
      sign_in_and_redirect @user, event: :authentication # this will throw if @user is not activated
      set_flash_message(:notice, :success, kind: "GitHub") if is_navigational_format?
    else
      redirect_to :root, notice: @user.errors.to_a.to_s
    end
  end
end
