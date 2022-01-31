# frozen_string_literal: true

require "test_helper"

class UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = build :user
  end

  test "user_path should return a path with friendly_id" do
    @user.name = "pedra"
    @user.save
    assert_includes user_path(@user), "pedra"
  end

  test "should get show" do
    @user.save
    get user_path(@user)
    assert_response :success
  end

  test "should only show visible posts on get show" do
    public_post = create :post
    not_listed_post = create :post, visibility: :not_listed
    private_post = create :post, visibility: :private

    @user.posts = [public_post, not_listed_post, private_post]
    @user.save
    @user.posts.each do |p|
      Star.create user: @user, starable: p
    end

    get user_path(@user)
    posts = assigns(:posts)
    stars = assigns(:starred_posts)

    assert_includes posts, public_post
    refute_includes posts, not_listed_post
    refute_includes posts, private_post

    assert_includes stars, public_post
    refute_includes stars, not_listed_post
    refute_includes stars, private_post
  end
end
