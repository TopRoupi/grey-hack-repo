# frozen_string_literal: true

require "test_helper"

class FileableTest < ActiveSupport::TestCase
  setup do
    # using post as fileable
    @fileable = build :post
  end

  test "strong_params should return params list given the fileable params" do
    params = {
      "title" => "",
      "category_id" => "1",
      "summary" => "",
      "readme" => "",
      "folders_attributes" => {
        "0" => {
          "name" => "",
          "_destroy" => "false",
          "scripts_attributes" => {
            "0" => {"name" => "", "content" => "", "_destroy" => "false"}
          },
          "folders_attributes" => {"0" => {"name" => "", "_destroy" => "false"}}
        }
      }
    }

    expected_result = [
      {scripts_attributes: [:id, :name, :content, :_destroy]},
      {folders_attributes: [
        :id,
        :name,
        :_destroy,
        {scripts_attributes: [:id, :name, :content, :_destroy]},
        {folders_attributes: [:id, :name, :_destroy, {scripts_attributes: [:id, :name, :content, :_destroy]}]}
      ]}
    ]

    assert_equal Fileable.strong_params(params), expected_result
  end
end
