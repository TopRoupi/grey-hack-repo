# frozen_string_literal: true

require "test_helper"

class CategoriesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @category = build :category
  end

  test "should get show" do
    @category.save
    get category_path @category
    assert_response :success
  end
end
