# frozen_string_literal: true

require "test_helper"

class BuildsControllerTest < ActionDispatch::IntegrationTest
  class GuestUser < ActionDispatch::IntegrationTest
    setup do
      @build = build :build
    end

    test "should get diff" do
      @build.save
      get build_diff_url(@build)
      assert_response :success
    end

    test "should get diff if its unpublished" do
      @build.published = false
      @build.save
      get build_diff_url(@build)
      assert_response :redirect
      get build_diff_url(@build, unpublished: true)
      assert_response :redirect
    end

    test "should not publish a build" do
      @build.published = false
      @build.save

      patch build_publish_url(@build)
      @build.reload
      assert_equal @build.published, false
      assert_response :redirect
    end

    test "should not destroy a build" do
      @build.save

      delete build_url(@build)
      refute_empty Build.where(id: @build.id)
      assert_response :redirect
    end
  end

  class LoggedUser < ActionDispatch::IntegrationTest
    setup do
      @user = create :user
      sign_in @user
      @build = build :build
    end

    test "should get unpublished diff if the user owns the build" do
      @build.post.user = @user
      @build.published = false
      @build.save

      get build_diff_url(@build, unpublished: true)
      assert_response :success
    end

    test "should not get unpublished diff if user dont own the build" do
      @build.post.user = build :user
      @build.published = false
      @build.save

      get build_diff_url(@build, unpublished: true)
      assert_response :redirect
    end

    test "should destroy owned build" do
      @build.post.user = @user
      @build.save

      delete build_url(@build)
      assert_response :redirect
      assert_empty Build.where(id: @build.id)
    end

    test "should not destroy an not owned build" do
      @build.post.user = build :user
      @build.save

      delete build_url(@build)
      assert_response :redirect
      refute_empty Build.where(id: @build.id)
    end

    test "should publish build" do
      @build.post.user = @user
      @build.published = false
      @build.save

      patch build_publish_url(@build)
      assert_response :redirect
      @build.reload
      assert_equal @build.published, true
    end

    test "should not publish unowned build" do
      @build.post.user = build :user
      @build.published = false
      @build.save

      patch build_publish_url(@build)
      assert_response :redirect
      @build.reload
      assert_equal @build.published, false
    end
  end
end
