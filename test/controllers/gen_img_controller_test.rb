require "test_helper"

class GenImgControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get gen_img_index_url
    assert_response :success
  end
end
