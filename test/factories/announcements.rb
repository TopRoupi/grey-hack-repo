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
FactoryBot.define do
  factory :announcement do
    message { "MyString" }
    association :guild
    association :user
  end
end
