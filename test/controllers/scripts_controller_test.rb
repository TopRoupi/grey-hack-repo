# frozen_string_literal: true

require "test_helper"

class ScriptsControllerTest < ActionDispatch::IntegrationTest
  class GuestUser < ActionDispatch::IntegrationTest
    setup do
      @script = build :script
    end

    test "should show script" do
      @script.save
      get script_url(@script, format: :json)
      assert_response :success
    end

    test "should not get edit" do
      @script.save

      get edit_script_url(@script)
      assert_response :redirect
    end

    test "should not update" do
      @script.save

      patch script_url(@script), params: {script: {name: "aaaA"}}
      assert_redirected_to new_user_session_url
    end
  end

  class LoggedUser < ActionDispatch::IntegrationTest
    setup do
      @user = create :user
      sign_in @user
      @script = build :script
    end

    test "should get edit of its own scripts" do
      @script.scriptable.post.user = @user
      @script.save

      get edit_script_url(@script)
      assert_response :success
    end

    test "should not get edit of ramdom scripts" do
      @script.scriptable.post.user = build(:user)
      @script.save

      get edit_script_url(@script)
      assert_redirected_to :root
    end

    test "should update its own scripts" do
      @script.scriptable.post.user = @user
      @script.save

      patch script_url(@script), params: {script: {name: "aAAA"}}
      assert_response :success
    end

    test "should not update ramdom scripts" do
      @script = create :script

      patch script_url(@script), params: {script: {script: "aaaA"}}
      assert_redirected_to :root
    end
  end
end
