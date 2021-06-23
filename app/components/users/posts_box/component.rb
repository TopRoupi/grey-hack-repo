# frozen_string_literal: true

class Users::PostsBox::Component < ApplicationComponent
  def initialize(user:, posts:, pagy:, active_tab: :all)
    @user = user
    @posts = posts
    @pagy = pagy
    @active_tab = active_tab
  end
end
