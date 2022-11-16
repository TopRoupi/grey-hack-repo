require "test_helper"

class InvitesControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get invites_create_url
    assert_response :success
  end

  test "should get accept" do
    get invites_accept_url
    assert_response :success
  end

  test "should get deny" do
    get invites_deny_url
    assert_response :success
  end
end
