# == Schema Information
#
# Table name: announcements
#
#  id         :bigint           not null, primary key
#  message    :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  guild_id   :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_announcements_on_guild_id  (guild_id)
#  index_announcements_on_user_id   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (guild_id => guilds.id)
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class AnnouncementTest < ActiveSupport::TestCase
  setup do
    @announcement = build :announcement
  end

  test "validate message" do
    @announcement.message = nil
    @announcement.valid?
    refute_empty @announcement.errors[:message]
    @announcement.message = "a" * 3
    @announcement.valid?
    refute_empty @announcement.errors[:message]
    @announcement.message = "a" * 701
    @announcement.valid?
    refute_empty @announcement.errors[:message]
    @announcement.message = "a" * 100
    @announcement.valid?
    assert_empty @announcement.errors[:message]
  end
end
