# frozen_string_literal: true

require "test_helper"

class GistTest < ActiveSupport::TestCase
  setup do
    @gist = build :gist
  end

  test "validate name" do
    @gist.name = nil
    @gist.valid?
    refute_empty @gist.errors[:name]
    @gist.name = "a" * 2
    @gist.valid?
    refute_empty @gist.errors[:name]
    @gist.name = "a" * 33
    @gist.valid?
    refute_empty @gist.errors[:name]
    @gist.name = "a" * 32
    @gist.valid?
    assert_empty @gist.errors[:name]
  end

  test "validate description" do
    @gist.description = nil
    @gist.valid?
    refute_empty @gist.errors[:description]
    @gist.description = "a" * 5
    @gist.valid?
    refute_empty @gist.errors[:description]
    @gist.description = "a" * 231
    @gist.valid?
    refute_empty @gist.errors[:description]
    @gist.description = "a" * 200
    @gist.valid?
    assert_empty @gist.errors[:description]
  end

  test "invalid without a script" do
    @gist.scripts = []
    @gist.valid?
    refute_empty @gist.errors[:scripts]
  end
end
