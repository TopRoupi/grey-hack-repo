# frozen_string_literal: true

# == Schema Information
#
# Table name: gists
#
#  id          :bigint           not null, primary key
#  anonymous   :boolean          default(TRUE), not null
#  description :string
#  name        :string
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :bigint
#
# Indexes
#
#  index_gists_on_slug     (slug) UNIQUE
#  index_gists_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
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
    @gist.user = nil
    @gist.anonymous = false
    assert_equal User.anonymous_user, @gist.author
  end
end
