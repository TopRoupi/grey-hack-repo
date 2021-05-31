# frozen_string_literal: true

FactoryBot.define do
  factory :post do
    association :user
    association :category
    scripts { [build(:script, post: nil)] }
    title { Faker::Lorem.characters(number: 15) }
    summary { Faker::Lorem.characters(number: 50) }
    readme { Faker::Lorem.characters(number: 200) }
  end
end