# == Schema Information
#
# Table name: gists
#
#  id          :bigint           not null, primary key
#  name        :string
#  description :string
#  user_id     :bigint
#  anonymous   :boolean          default(TRUE), not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  slug        :string
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
