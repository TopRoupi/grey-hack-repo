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

  test "author should return anonymous user if anonymous or user if not anonymous" do
    @gist = build :gist, :as_user
    @gist.anonymous = false
    assert_equal @gist.user, @gist.author
    @gist = build :gist, :as_user
    @gist.anonymous = true
    assert_equal User.anonymous_user, @gist.author
    @gist = build :gist, :as_anonymous
    assert_equal User.anonymous_user, @gist.author
    @gist = build :gist, :as_anonymous
    @gist.anonymous = false
    assert_equal User.anonymous_user, @gist.author
  end
end
