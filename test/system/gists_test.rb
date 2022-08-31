require "application_system_test_case"

class GistsTest < ApplicationSystemTestCase
  setup do
    @gist = gists(:one)
  end

  test "visiting the index" do
    visit gists_url
    assert_selector "h1", text: "Gists"
  end

  test "should create gist" do
    visit gists_url
    click_on "New gist"

    click_on "Create Gist"

    assert_text "Gist was successfully created"
    click_on "Back"
  end

  test "should update Gist" do
    visit gist_url(@gist)
    click_on "Edit this gist", match: :first

    click_on "Update Gist"

    assert_text "Gist was successfully updated"
    click_on "Back"
  end

  test "should destroy Gist" do
    visit gist_url(@gist)
    click_on "Destroy this gist", match: :first

    assert_text "Gist was successfully destroyed"
  end
end
