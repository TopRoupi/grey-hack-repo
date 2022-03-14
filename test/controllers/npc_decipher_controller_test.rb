# frozen_string_literal: true

require "test_helper"

class NpcDecipherControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get npc_decipher_url
    assert_response :success
  end
end
