# frozen_string_literal: true

FactoryBot.define do
  factory :script do
    association :post
    name { Faker::Lorem.characters(number: 20) }
    content { Faker::Lorem.characters(number: 500) }
  end
end
