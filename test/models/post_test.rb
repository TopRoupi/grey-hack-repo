# frozen_string_literal: true

require "test_helper"

class PostTest < ActiveSupport::TestCase
  setup do
    @post = build :post
  end

  # TODO move this test to isolated concern test file

  # files

  test "valid with a valid script" do
    @post.scripts = [build(:script, scriptable: nil)]
    @post.valid?
    assert_empty @post.errors[:files]
  end

  test "valid with a script in a folder" do
    folder_with_script = build(:folder, foldable: nil)
    folder_with_script.scripts = [build(:script, scriptable: nil)]
    @post.scripts = []
    @post.folders = [folder_with_script]
    @post.valid?
    assert_empty @post.errors[:files]
  end

  test "invalid without a script" do
    folder_without_script = build(:folder, foldable: nil, scripts: [])
    @post.scripts = []
    @post.folders = [folder_without_script]
    @post.valid?
    refute_empty @post.errors[:files]
  end

  # #has_script? method

  test "#has_script? returns true if it have a script" do
    @post.scripts << build(:script, scriptable: nil)
    assert @post.has_script?
  end

  test "#has_script? returns true if it have a script in a folder" do
    folder_with_script = build(:folder, foldable: nil, scripts: [build(:script, scriptable: nil)])
    @post.scripts = []
    @post.folders = [folder_with_script]
    assert @post.has_script?
  end

  test "#has_script? returns false if it does not have a script" do
    folder_without_script = build(:folder, foldable: nil, scripts: [])
    @post.scripts = []
    @post.folders = [folder_without_script]
    refute @post.has_script?
  end

  # title

  test "invalid witout a title" do
    @post.title = nil
    @post.valid?
    refute_empty @post.errors[:title]
  end

  test "invalid with a title of length 33" do
    @post.title = "a" * 33
    @post.valid?
    refute_empty @post.errors[:title]
  end

  test "valid with a title of length 32" do
    @post.title = "a" * 32
    @post.valid?
    assert_empty @post.errors[:title]
  end

  # summary

  test "invalid without a summary" do
    @post.summary = nil
    @post.valid?
    refute_empty @post.errors[:summary]
  end

  test "invalid with a summary of length 231" do
    @post.summary = "a" * 231
    @post.valid?
    refute_empty @post.errors[:summary]
  end

  test "valid with a summary of length 230" do
    @post.summary = "a" * 230
    @post.valid?
    assert_empty @post.errors[:summary]
  end

  # readme

  test "invalid with a read of length 50_001" do
    @post.readme = "a" * 50_001
    @post.valid?
    refute_empty @post.errors[:readme]
  end
end
