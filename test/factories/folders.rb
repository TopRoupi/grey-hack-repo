# frozen_string_literal: true

FactoryBot.define do
  factory :folder do
    for_post

    trait :for_post do
      association(:foldable, factory: :post)
    end

    name { "folder" }
    scripts { [build(:script, scriptable: nil)] }
  end
end
