# frozen_string_literal: true

require "test_helper"

class PostsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @post = build :post
  end

  test "should get index" do
    get posts_url
    assert_response :success
  end

  test "should show post" do
    @post.save
    get post_url(@post)
    assert_response :success
  end

  test "not get edit" do
    @post.save

    get edit_post_url(@post)
    assert_response :redirect
  end

  test "should not update post" do
    @post.save

    patch post_url(@post), params: {post: {summary: @post.summary, title: @post.title + "aaaA"}}
    assert_redirected_to new_user_session_path
  end

  test "should not destroy post" do
    @post.save

    assert_difference("Post.count", 0) do
      delete post_url(@post)
    end

    assert_redirected_to new_user_session_path
  end

  context "logged user" do
    setup do
      @user = create :user
      sign_in @user
    end

    should "get new" do
      get new_post_url
      assert_response :success
    end

    should "create post" do
      @post = build :post, category: create(:category)
      @script = @post.scripts.first

      assert_difference("Post.count") do
        post posts_url, params: {post: {summary: @post.summary, readme: @post.readme, title: @post.title, category_id: @post.category_id, scripts_attributes: {"0": {content: @script.content}}}}
      end

      assert_redirected_to post_url(Post.last)
    end

    should "get edit of its own posts" do
      @post = create :post, user: @user

      get edit_post_url(@post)
      assert_response :success
    end

    should "not get edit of ramdom posts" do
      @post = create :post

      get edit_post_url(@post)
      assert_redirected_to :root
    end

    should "update its own posts" do
      @post = create :post, user: @user

      patch post_url(@post), params: {post: {summary: @post.summary, title: @post.title + "aaaA"}}
      assert_redirected_to post_path(@post)
    end

    should "not update ramdom posts" do
      @post = create :post

      patch post_url(@post), params: {post: {summary: @post.summary, title: @post.title + "aaaA"}}
      assert_redirected_to :root
    end

    should "destroy its own post" do
      @post = create :post, user: @user

      assert_difference("Post.count", -1) do
        delete post_url(@post)
      end

      assert_redirected_to posts_url
    end

    should "not destroy ramdom post" do
      @post = create :post

      assert_difference("Post.count", 0) do
        delete post_url(@post)
      end

      assert_redirected_to :root
    end
  end
end
