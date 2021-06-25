# frozen_string_literal: true

FactoryBot.define do
  factory :category do
    name { Faker::Lorem.characters(number: 15) }
    icon { "pencil" }
    description { Faker::Lorem.characters(number: 40) }
  end
end
