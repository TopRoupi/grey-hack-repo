require "test_helper"

class CompressorControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get compressor_index_url
    assert_response :success
  end
end
