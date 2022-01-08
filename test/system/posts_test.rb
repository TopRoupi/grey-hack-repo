# frozen_string_literal: true

require "application_system_test_case"

class PostsTest < ApplicationSystemTestCase
  setup do
    @user = create :user
    sign_in @user
    create :category, name: "Tools"
    @post = build :post
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
    select("Tools", from: "Category")
    fill_in "Summary", with: @post.summary
    find("trix-editor").click.set(@post.readme)
    click_on "Add script"
    click_on "Edit"
    fill_in "Name", with: "script"
    fill_in "Content", with: "script content ..........."
    click_on "Create Post"

    assert_text "Post was successfully created"
  end

  test "updating a Post" do
    @post.user = @user
    @post.save
    visit posts_url
    click_on "Edit", match: :first

    fill_in "Title", with: @post.title
    click_on "Update Post"

    assert_text "Post was successfully updated"
  end

  test "destroying a Post" do
    @post.user = @user
    @post.save
    visit posts_url
    page.accept_confirm do
      click_on "Destroy", match: :first
    end

    assert_text "Post was successfully destroyed"
  end
end
