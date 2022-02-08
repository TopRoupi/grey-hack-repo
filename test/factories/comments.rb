# frozen_string_literal: true

FactoryBot.define do
  factory :comment do
    for_post

    trait :for_post do
      association(:commentable, factory: :post)
    end

    association :user
    content { Faker::Lorem.characters(number: 200) }
  end
end
