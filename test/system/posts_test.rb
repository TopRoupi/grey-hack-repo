# frozen_string_literal: true

require "application_system_test_case"

class PostsTest < ApplicationSystemTestCase
  setup do
    @user = create :user
    sign_in @user
    @category = create :category, name: "Tools"
    @post = build :post, category: @category
  end

  test "visiting the index" do
    visit posts_url
    assert_text "Category"
  end

  test "creating a Post" do
    visit posts_url
    click_on "Open user menu"
    click_on "Create a new post"

    fill_in "Title", with: @post.title
    fill_in "Summary", with: @post.summary
    find("trix-editor").click.set(@post.readme)
    select("Tools", from: "Category")
    click_on "Create Post"

    assert_text "Post was successfully created"

    visit my_posts_url(@post)

    click_on "Not Published", match: :first

    click_on "Manage builds", match: :first

    click_on "Add Build", match: :first

    click_on "edit build", match: :first

    click_on "Add script", match: :first

    click_on "draft_script.src", match: :first

    fill_in "Name", with: "script.src"

    find(".code-editor").click.set("script content ....")

    click_on "Update Script", match: :first

    assert_text "Script updated"

    find("#publish-#{Build.last.id}").click

    click_on "Publish", match: :first

    find("#publish-post").click

    click_on "Publish", match: :first

    assert_text "Post #{@post.title} published"
  end

  test "updating a Post" do
    @post.user = @user
    @post.save
    visit my_posts_url
    click_on "Edit", match: :first

    fill_in "Title", with: @post.title
    click_on "Update Post"

    assert_text "Post was successfully updated"
  end

  test "destroying a Post" do
    @post.user = @user
    @post.save
    visit my_posts_url

    find("#delete_post_#{@post.id}").click
    click_on "Delete"

    assert_text "Post was successfully destroyed"
  end
end
