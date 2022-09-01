require "test_helper"

class GistsControllerTest < ActionDispatch::IntegrationTest
  class GuestUser < ActionDispatch::IntegrationTest
    setup do
      @gist = create :gist, :as_anonymous
    end

    test "guest user should get index" do
      get gists_url
      assert_response :success
    end

    test "guest user should get new" do
      get new_gist_url
      assert_response :success
    end

    test "guest user should show gist" do
      get gist_url(@gist)
      assert_response :success
    end

    test "guest user should create gist" do
      assert_difference("Gist.count") do
        post gists_url, params: {gist: {name: @gist.name, scripts_attributes: {"0": {name: "script.src", content: "dwadawfnsefgsefg"}}}}
      end

      assert_redirected_to gist_url(Gist.last)
    end

    test "guest user should not get edit" do
      get edit_gist_url(@gist)
      assert_redirected_to new_user_session_path
    end

    test "should not update gist" do
      old_name = @gist.name
      patch gist_url(@gist), params: {gist: {name: "new name", scripts_attributes: {"0": {name: "script.src", content: "dwadawfnsefgsefg"}}}}
      @gist.reload
      assert_equal old_name, @gist.name
      assert_redirected_to new_user_session_path
    end

    test "should not destroy gist" do
      assert_difference("Gist.count", 0) do
        delete gist_url(@gist)
      end

      assert_redirected_to new_user_session_path
    end
  end

  class LoggedUser < ActionDispatch::IntegrationTest
    setup do
      @gist = create :gist, :as_user
      sign_in @gist.user
    end

    test "guest user should create gist" do
      assert_difference("Gist.count") do
        post gists_url, params: {gist: {name: @gist.name, scripts_attributes: {"0": {name: "script.src", content: "dwadawfnsefgsefg"}}}}
      end

      assert_redirected_to gist_url(Gist.last)
    end

    test "logged user should get edit" do
      get edit_gist_url(@gist)
      assert_response :success
    end

    test "logged user should get edit of unownned gist" do
      u = create :user
      sign_in u
      get edit_gist_url(@gist)

      assert_redirected_to :root
    end

    test "logged user should update gist" do
      new_name = "new name"
      patch gist_url(@gist), params: {gist: {name: new_name, scripts_attributes: {"0": {name: "script.src", content: "dwadawfnsefgsefg"}}}}
      @gist.reload
      assert_equal new_name, @gist.name
      assert_redirected_to gist_url @gist
    end

    test "logged user should not update gist of unownned gists" do
      u = create :user
      sign_in u
      old_name = @gist.name
      patch gist_url(@gist), params: {gist: {name: "new name", scripts_attributes: {"0": {name: "script.src", content: "dwadawfnsefgsefg"}}}}
      @gist.reload
      assert_equal old_name, @gist.name
      assert_redirected_to :root
    end

    test "logged should destroy gist" do
      assert_difference("Gist.count", -1) do
        delete gist_url(@gist)
      end

      assert_redirected_to gists_url
    end

    test "logged should not destroy unownned gist" do
      u = create :user
      sign_in u

      assert_difference("Gist.count", 0) do
        delete gist_url(@gist)
      end

      assert_redirected_to :root
    end
  end
end
