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
end
