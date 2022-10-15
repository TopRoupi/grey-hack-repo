# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  name                   :string           not null
#  bank                   :string
#  btc                    :string
#  encrypted_password     :string           default(""), not null
#  remember_created_at    :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  email                  :string           not null
#  avatar                 :string
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  admin                  :boolean
#  provider               :string
#  uid                    :string
#  supporter              :boolean
#
require "test_helper"

class UserTest < ActiveSupport::TestCase
  setup do
    @user = build :user
  end

  # name

  test "invalid invalide a name length" do
    @user.name = nil
    @user.valid?
    refute_empty @user.errors[:name]
    @user.name = "0" * 2
    @user.valid?
    refute_empty @user.errors[:name]
    @user.name = "0" * 16
    @user.valid?
    assert_empty @user.errors[:name]
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

  test "invalid with a password with invalid length" do
    @user.password = "a" * 5
    @user.valid?
    refute_empty @user.errors[:password]
    @user.password = "a" * 128
    @user.valid?
    assert_empty @user.errors[:password]
    @user.password = "a" * 129
    @user.valid?
    refute_empty @user.errors[:password]
  end

  test "#anonymous_user should return an obj that quacks like a user with anon data" do
    anon = User.anonymous_user
    refute_nil anon.name
    refute_nil anon.email
    refute_nil anon.avatar
  end
end
