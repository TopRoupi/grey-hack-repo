# frozen_string_literal: true

FactoryBot.define do
  factory :script do
    for_build

    trait :for_build do
      association(:scriptable, factory: :build)
    end

    name { Faker::Lorem.characters(number: 20) }
    content { Faker::Lorem.characters(number: 500) }
  end
end
