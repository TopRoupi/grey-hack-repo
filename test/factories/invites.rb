# == Schema Information
#
# Table name: invites
#
#  id            :bigint           not null, primary key
#  accepted_date :date
#  key           :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  guild_id      :bigint           not null
#  user_id       :bigint           not null
#
# Indexes
#
#  index_invites_on_guild_id  (guild_id)
#  index_invites_on_key       (key) UNIQUE
#  index_invites_on_user_id   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (guild_id => guilds.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :invite do
    association :user
    association :guild
    key { Faker::Lorem.characters(number: 32) }
    accepted_date { nil }
  end
end
