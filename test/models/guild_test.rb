# == Schema Information
#
# Table name: guilds
#
#  id                :bigint           not null, primary key
#  avatar_data       :text
#  badge_data        :text
#  banner_data       :text
#  description       :string
#  name              :string
#  registration      :integer          default("closed")
#  registration_info :string
#  slug              :string
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
    @guild.name = "a" * 17
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
