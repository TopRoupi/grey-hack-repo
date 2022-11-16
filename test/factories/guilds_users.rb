# == Schema Information
#
# Table name: guilds_users
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  guild_id   :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_guilds_users_on_guild_id  (guild_id)
#  index_guilds_users_on_user_id   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (guild_id => guilds.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :guilds_user do
    user { "MyString" }
    guild { "MyString" }
  end
end
