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
end
