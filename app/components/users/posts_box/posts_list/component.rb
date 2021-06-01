class Users::PostsBox::PostsList::Component < ApplicationComponent
  def initialize(user:, posts:)
    @user = user
    @posts = posts
  end
end
