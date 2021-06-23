# frozen_string_literal: true

class Users::PostsBox::PostsList::Component < ApplicationComponent
  def initialize(user:, posts:, pagy:, link: "")
    @user = user
    @posts = posts
    @pagy = pagy
    @link = link
  end
end
