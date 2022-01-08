# frozen_string_literal: true

require "test_helper"

class ScriptsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @script = build :script
  end

  test "should show scrpit" do
    @script.save
    get script_url(@script, format: :json)
    assert_response :success
  end
end
