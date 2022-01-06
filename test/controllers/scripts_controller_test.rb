require "test_helper"

class ScriptsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get scripts_show_url
    assert_response :success
  end
end
