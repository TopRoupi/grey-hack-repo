# frozen_string_literal: true

require "test_helper"

class FileableTest < ActiveSupport::TestCase
  setup do
    # using post as fileable
    @fileable = build :post
  end

  test "#children_index_table should index all fileable files in a hash" do
    @fileable.scripts = []
    folder = @fileable.folders.build
    folder_folder = folder.folders.build
    script = @fileable.scripts.build
    folder_script = folder.scripts.build
    folder_folder_script = folder_folder.scripts.build

    expected_result = {
      0 => @fileable,
      1 => script,
      2 => folder,
      3 => folder_script,
      4 => folder_folder,
      5 => folder_folder_script
    }

    assert_equal expected_result, @fileable.children_index_table
  end

  test "Fileable.strong_params should return params list given the fileable params" do
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

    assert_equal expected_result, Fileable.strong_params(params)
  end
end
