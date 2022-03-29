# frozen_string_literal: true

class Users::PostsList < ApplicationComponent
  def initialize(user:, current_user:, posts:, pagy:)
    @user = user
    @current_user = current_user
    @posts = posts
    @pagy = pagy
  end
end
