# frozen_string_literal: true

require "test_helper"

class UserTest < ActiveSupport::TestCase
  setup do
    @user = build :user
  end

  # name

  test "invalid without a name" do
    @user.name = nil
    @user.valid?
    refute_empty @user.errors[:name]
  end

  test "invalid with a name of 2 characters" do
    @user.name = "0" * 2
    @user.valid?
    refute_empty @user.errors[:name]
  end

  test "valid with a name of 16 characters" do
    @user.name = "0" * 16
    @user.valid?
    assert_empty @user.errors[:name]
  end

  test "invalid with a name of 17 characters" do
    @user.name = "a" * 17
    @user.valid?
    refute_empty @user.errors[:name]
  end

  test "invalid without a uniq name" do
    create :user, name: "pedra"
    @user.name = "pedra"
    @user.valid?
    refute_empty @user.errors[:name]
  end

  test "valid if the name has _ -" do
    @user.name = "a_---____"
    @user.valid?
    assert_empty @user.errors[:name]
  end

  test "invalid if the name includes spaces" do
    @user.name = "a adawda a "
    @user.valid?
    refute_empty @user.errors[:name]
  end

  # password

  test "invalid without a password" do
    @user.password = nil
    @user.valid?
    refute_empty @user.errors[:password]
  end

  test "invalid with a password of length 5" do
    @user.password = "a" * 5
    @user.valid?
    refute_empty @user.errors[:password]
  end

  test "valid with a password of length 32" do
    @user.password = "a" * 32
    @user.valid?
    assert_empty @user.errors[:password]
  end

  test "invalid with a password of length 33" do
    @user.password = "a" * 33
    @user.valid?
    refute_empty @user.errors[:password]
  end
end
