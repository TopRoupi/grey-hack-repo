# frozen_string_literal: true

require "test_helper"

class PostsControllerTest < ActionDispatch::IntegrationTest
  class GuestUser < ActionDispatch::IntegrationTest
    setup do
      @post = build :post
    end

    test "should get index" do
      get posts_url
      assert_response :success
    end

    test "should only show visible posts on get index" do
      public_post = create :post
      not_listed_post = create :post, visibility: :not_listed
      private_post = create :post, visibility: :private

      get posts_url
      posts = assigns(:posts)

      assert_includes posts, public_post
      refute_includes posts, not_listed_post
      refute_includes posts, private_post
    end

    test "should show post" do
      @post.save
      get post_url(@post)
      assert_response :success
    end

    test "should not show private posts" do
      @post.visibility = :private
      @post.save

      get post_url(@post)

      assert_redirected_to :root
    end

    test " should not get edit" do
      @post.save

      get edit_post_url(@post)
      assert_response :redirect
    end

    test "should not update post" do
      @post.save

      patch post_url(@post), params: {post: {summary: @post.summary, title: @post.title + "aaaA"}}
      assert_redirected_to new_user_session_url
    end

    test "should not destroy post" do
      @post.save

      assert_difference("Post.count", 0) do
        delete post_url(@post)
      end

      # assert_redirected_to new_user_session_path
    end
  end

  class LoggedUser < ActionDispatch::IntegrationTest
    setup do
      @user = create :user
      sign_in @user
    end

    test "should not show private posts of other users" do
      private_post = create :post, visibility: :private

      get post_url(private_post)

      assert_redirected_to :root
    end

    test "should show ownned private posts" do
      private_post = create :post, visibility: :private, user: @user

      get post_url(private_post)

      assert_response :success
    end

    test " should get new" do
      get new_post_url
      assert_response :success
    end

    test "should create post" do
      @post = build :post, category: create(:category)
      @build = @post.builds.first
      @script = @build.scripts.first

      assert_difference("Post.count") do
        post posts_url, params: {post: {summary: @post.summary, readme: @post.readme, title: @post.title, category_id: @post.category_id, builds_attributes: {"0": {name: @build.name, scripts_attributes: {"0": {name: @script.name, content: @script.content}}}}}}
      end

      assert_redirected_to post_url(Post.last)
    end

    test "should get edit of its own posts" do
      @post = create :post, user: @user

      get edit_post_url(@post)
      assert_response :success
    end

    test "should not get edit of ramdom posts" do
      @post = create :post

      get edit_post_url(@post)
      assert_redirected_to :root
    end

    test "should update its own posts" do
      @post = create :post, user: @user

      patch post_url(@post), params: {post: {summary: @post.summary, title: @post.title + "aaaA"}}
      assert_redirected_to post_url(@post)
    end

    test "should not update ramdom posts" do
      @post = create :post

      patch post_url(@post), params: {post: {summary: @post.summary, title: @post.title + "aaaA"}}
      assert_redirected_to :root
    end

    test "should destroy its own post" do
      @post = create :post, user: @user

      assert_difference("Post.count", -1) do
        delete post_url(@post)
      end

      assert_redirected_to root_path
    end

    test "should not destroy ramdom post" do
      @post = create :post

      assert_difference("Post.count", 0) do
        delete post_url(@post)
      end

      assert_redirected_to :root
    end
  end
end
