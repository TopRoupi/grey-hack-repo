# frozen_string_literal: true

require "test_helper"

class ApplicationHelperTest < ActionView::TestCase
  test "path_params should return a hash of the params" do
    path = "/home?a=a&b=b"
    expected_result = {"a" => "a", "b" => "b"}
    assert_equal expected_result, path_params(path)
  end

  test "path_params should return a nil for a path without params" do
    path = "/home"
    assert_nil path_params(path)
  end

  test "path_to should merge path params" do
    path = "/home?a=a&b=b"
    options = {"b" => "c", "c" => "d"}
    expected_result = "/home?a=a&b=c&c=d"
    assert_equal expected_result, path_to(path, options)
  end
end
