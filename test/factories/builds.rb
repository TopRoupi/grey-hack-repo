# frozen_string_literal: true

FactoryBot.define do
  factory :build do
    association :post
    scripts { [build(:script, scriptable: nil)] }
    name { Faker::Lorem.characters(number: 10) }
  end
end
