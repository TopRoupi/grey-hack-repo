# frozen_string_literal: true

# == Schema Information
#
# Table name: posts
#
#  id          :bigint           not null, primary key
#  description :string
#  published   :boolean          default(FALSE), not null
#  readme      :string
#  slug        :string
#  stars_count :integer          default(0)
#  summary     :string
#  title       :string
#  visibility  :integer          default("public")
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :bigint
#  user_id     :bigint           not null
#
# Indexes
#
#  index_posts_on_category_id  (category_id)
#  index_posts_on_slug         (slug) UNIQUE
#  index_posts_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (user_id => users.id)
#
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

  # builds

  test "should be valid without builds if unpublished" do
    @post.published = false
    @post.builds = []
    @post.valid?

    assert_empty @post.errors[:builds]
  end

  test "should be invalid without builds if published is true" do
    @post.published = true
    @post.builds = []
    @post.valid?

    refute_empty @post.errors[:builds]
  end

  test "should update published status after all published builds gets deleted" do
    @post.builds.each do |b|
      b.destroy
    end

    refute @post.published
  end
end
