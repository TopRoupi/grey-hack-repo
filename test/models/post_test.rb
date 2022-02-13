# frozen_string_literal: true

require "test_helper"

class PostTest < ActiveSupport::TestCase
  setup do
    @post = build :post
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
