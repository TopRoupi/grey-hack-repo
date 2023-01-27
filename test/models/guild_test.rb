# == Schema Information
#
# Table name: guilds
#
#  id                :bigint           not null, primary key
#  alignment         :integer          default("grey")
#  avatar_data       :text
#  badge_data        :text
#  banner_data       :text
#  description       :string
#  name              :string
#  registration      :integer          default("closed")
#  registration_info :string
#  slug              :string
#  tag               :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :bigint
#
# Indexes
#
#  index_guilds_on_name     (name) UNIQUE
#  index_guilds_on_slug     (slug) UNIQUE
#  index_guilds_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class GuildTest < ActiveSupport::TestCase
  setup do
    @guild = build :guild
  end

  test "validate name" do
    @guild.name = nil
    @guild.valid?
    refute_empty @guild.errors[:name]
    @guild.name = "a" * 2
    @guild.valid?
    refute_empty @guild.errors[:name]
    @guild.name = "a" * 33
    @guild.valid?
    refute_empty @guild.errors[:name]
    @guild.name = "a" * 16
    @guild.valid?
    assert_empty @guild.errors[:name]
  end

  test "invalid without unique name" do
    create :guild, name: "ttt"
    @guild.name = "ttt"
    @guild.valid?
    refute_empty @guild.errors[:name]
  end

  test "validate description" do
    @guild.description = nil
    @guild.valid?
    refute_empty @guild.errors[:description]
    @guild.description = "a" * 231
    @guild.valid?
    refute_empty @guild.errors[:description]
    @guild.description = "a" * 10
    @guild.valid?
    assert_empty @guild.errors[:description]
  end

  test "deleting a guild should not delete its members" do
    member = create(:user)
    @guild.members << member
    @guild.save
    @guild.reload
    @guild.destroy
    refute_nil User.find_by(id: member.id)
  end

  test "validate tag" do
    @guild.tag = nil
    @guild.valid?
    assert_empty @guild.errors[:tag]
    create :guild, tag: "LOL"
    @guild.tag = "LOL"
    @guild.valid?
    refute_empty @guild.errors[:tag]
    @guild.tag = "a" * 4
    @guild.valid?
    refute_empty @guild.errors[:tag]
    @guild.tag = "a" * 2
    @guild.valid?
    refute_empty @guild.errors[:tag]
    @guild.tag = "a" * 3
    @guild.valid?
    assert_empty @guild.errors[:tag]
  end

  test "validate alignment" do
    @guild.alignment = nil
    @guild.valid?
    assert_empty @guild.errors[:alignment]
    @guild.alignment = 0
    @guild.valid?
    assert_empty @guild.errors[:alignment]
    @guild.alignment = 1
    @guild.valid?
    assert_empty @guild.errors[:alignment]
    @guild.alignment = 2
    @guild.valid?
    assert_empty @guild.errors[:alignment]
  end

  test "validate registration_info" do
    @guild.registration_info = nil
    @guild.valid?
    assert_empty @guild.errors[:registration_info]
    @guild.registration_info = "a" * 65
    @guild.valid?
    refute_empty @guild.errors[:registration_info]
    @guild.registration_info = "a" * 64
    @guild.valid?
    assert_empty @guild.errors[:registration_info]
  end
end
