# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    name { Faker::Lorem.characters(number: 10) }
    password { Faker::Lorem.characters(number: 16) }
    bank { Faker::Lorem.characters(number: 7) }
    btc { Faker::Lorem.characters(number: 10) }
  end
end
