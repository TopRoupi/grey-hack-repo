class Users::PostsBox::Component < ApplicationComponent
  def initialize(user:)
    @user = user
    @posts = @user.posts.eager_load(:category, :user)
  end
end
