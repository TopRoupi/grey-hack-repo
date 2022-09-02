# frozen_string_literal: true

require "test_helper"

class ScriptTest < ActiveSupport::TestCase
  setup do
    @script = build :script
  end

  # content

  test "invalid without a content" do
    @script.content = nil
    @script.valid?
    refute_empty @script.errors[:content]
  end

  test "invalid with a content of length 80_001" do
    @script.content = "a" * 80_001
    @script.valid?
    refute_empty @script.errors[:content]
  end

  # name

  test "invalid without a name" do
    @script.name = nil
    @script.valid?
    refute_empty @script.errors[:name]
  end

  test "invalid with a name of length 25" do
    @script.name = "a" * 25
    @script.valid?
    refute_empty @script.errors[:name]
  end

  test "extension should return extension" do
    @script.name = "test"
    assert_nil @script.extension
    @script.name = "test.src"
    assert_equal @script.extension, "src"
    @script.name = "test.src.md"
    assert_equal @script.extension, "md"
  end

  test "find_build should return script's build" do
    @build = create :build
    assert_equal @build.scripts.last.find_build, @build
    @build = build :build
    @build.folders << build(:folder)
    assert_equal @build.folders.last.scripts.last.find_build, @build
  end
end
