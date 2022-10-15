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
FactoryBot.define do
  factory :gist do
    as_user

    trait :as_user do
      association :user
      anonymous { false }
    end

    trait :as_anonymous do
      anonymous { true }
    end

    name { Faker::Lorem.characters(number: 15) }
    description { Faker::Lorem.characters(number: 50) }
    scripts { [build(:script, scriptable: nil)] }
  end
end
