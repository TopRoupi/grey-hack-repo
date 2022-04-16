# frozen_string_literal: true

require "test_helper"

class FileableTest < ActiveSupport::TestCase
  setup do
    # using post as fileable
    @fileable = build :build
  end

  # files

  # TODO: this may be moved to builds test
  test "should be saved valid even without files when it is not published" do
    @fileable.scripts = []
    @fileable.folders = []

    @fileable.valid?
    assert_empty @fileable.errors[:files]
  end

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

  test "#build_published_status should find the fileable build and return its published status" do
    build_fileable = build :build, published: false

    assert_equal build_fileable.build_published_status, false

    folder_fileable = build :folder, foldable: build_fileable

    assert_equal folder_fileable.build_published_status, false

    inner_folder_fileable = build :folder, foldable: folder_fileable

    assert_equal inner_folder_fileable.build_published_status, false
  end
end
