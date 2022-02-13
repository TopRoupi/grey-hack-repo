# frozen_string_literal: true

require "test_helper"

class FileableTest < ActiveSupport::TestCase
  setup do
    # using post as fileable
    @fileable = build :build
  end

  # files

  test "valid with a valid script" do
    @fileable.scripts = [build(:script, scriptable: nil)]
    @fileable.valid?
    assert_empty @fileable.errors[:files]
  end

  test "valid with a script in a folder" do
    folder_with_script = build(:folder, foldable: nil)
    folder_with_script.scripts = [build(:script, scriptable: nil)]
    @fileable.scripts = []
    @fileable.folders = [folder_with_script]
    @fileable.valid?
    assert_empty @fileable.errors[:files]
  end

  test "invalid without a script" do
    folder_without_script = build(:folder, foldable: nil, scripts: [])
    @fileable.scripts = []
    @fileable.folders = [folder_without_script]
    @fileable.valid?
    refute_empty @fileable.errors[:files]
  end

  # #has_script? method

  test "#has_script? returns true if it have a script" do
    @fileable.scripts << build(:script, scriptable: nil)
    assert @fileable.has_script?
  end

  test "#has_script? returns true if it have a script in a folder" do
    folder_with_script = build(:folder, foldable: nil, scripts: [build(:script, scriptable: nil)])
    @fileable.scripts = []
    @fileable.folders = [folder_with_script]
    assert @fileable.has_script?
  end

  test "#has_script? returns false if it does not have a script" do
    folder_without_script = build(:folder, foldable: nil, scripts: [])
    @fileable.scripts = []
    @fileable.folders = [folder_without_script]
    refute @fileable.has_script?
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

  # TODO: move it to a proper place, and refactor
  # test "Fileable.strong_params should return params list given the fileable params" do
  #   params = {
  #     "title" => "",
  #     "category_id" => "1",
  #     "summary" => "",
  #     "readme" => "",
  #     "folders_attributes" => {
  #       "0" => {
  #         "name" => "",
  #         "_destroy" => "false",
  #         "scripts_attributes" => {
  #           "0" => {"name" => "", "content" => "", "_destroy" => "false"}
  #         },
  #         "folders_attributes" => {"0" => {"name" => "", "_destroy" => "false"}}
  #       }
  #     }
  #   }
  #
  #   expected_result = [
  #     {scripts_attributes: [:id, :name, :content, :_destroy]},
  #     {folders_attributes: [
  #       :id,
  #       :name,
  #       :_destroy,
  #       {scripts_attributes: [:id, :name, :content, :_destroy]},
  #       {folders_attributes: [:id, :name, :_destroy, {scripts_attributes: [:id, :name, :content, :_destroy]}]}
  #     ]}
  #   ]
  #
  #   assert_equal expected_result, Fileable.strong_params(params)
  # end
end
