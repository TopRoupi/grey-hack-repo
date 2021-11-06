# frozen_string_literal: true

FactoryBot.define do
  factory :script do
    for_post

    trait :for_post do
      association(:scriptable, factory: :post)
    end

    name { Faker::Lorem.characters(number: 20) }
    content { Faker::Lorem.characters(number: 500) }
  end
end
