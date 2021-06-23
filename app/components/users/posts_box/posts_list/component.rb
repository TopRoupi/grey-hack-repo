# frozen_string_literal: true

class Users::PostsBox::PostsList::Component < ApplicationComponent
  def initialize(user:, posts:, pagy:)
    @user = user
    @posts = posts
    @pagy = pagy
  end
end
