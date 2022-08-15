# frozen_string_literal: true

require "test_helper"

class FoldersControllerTest < ActionDispatch::IntegrationTest
  class GuestUser < ActionDispatch::IntegrationTest
    setup do
      @folder = build :folder
    end

    test "should not get edit" do
      @folder.save

      get edit_folder_url(@folder)
      assert_response :redirect
    end

    test "should not update" do
      @folder.save

      patch folder_url(@folder), params: {folder: {name: "aaaA"}}
      assert_redirected_to new_user_session_url
    end
  end

  class LoggedUser < ActionDispatch::IntegrationTest
    setup do
      @user = create :user
      sign_in @user
      @folder = build :folder
    end

    test "should get edit of its own folders" do
      @folder.foldable.post.user = @user
      @folder.save

      get edit_folder_url(@folder)
      assert_response :success
    end

    test "should not get edit of ramdom folder" do
      @folder.foldable.post.user = build(:user)
      @folder.save

      get edit_folder_url(@folder)
      assert_redirected_to :root
    end

    test "should update its own folder" do
      @folder.foldable.post.user = @user
      @folder.save

      patch folder_url(@folder), params: {folder: {name: "aAAA"}}
      assert_response :success
    end

    test "should not update ramdom folder" do
      @folder = create :folder

      patch folder_url(@folder), params: {folder: {folder: "aaaA"}}
      assert_redirected_to :root
    end
  end
end
