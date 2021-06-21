# frozen_string_literal: true

class Users::PostsBox::Component < ApplicationComponent
  def initialize(user:)
    @user = user
    @posts = @user.posts.eager.asc
  end
end
