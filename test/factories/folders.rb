# frozen_string_literal: true

FactoryBot.define do
  factory :folder do
    for_post

    trait :for_post do
      association(:foldable, factory: :post)
    end

    name { "folder" }
  end
end
