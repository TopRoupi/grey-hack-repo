# frozen_string_literal: true

FactoryBot.define do
  factory :folder do
    for_build

    trait :for_build do
      association(:foldable, factory: :build)
    end

    name { "folder" }
    scripts { [build(:script, scriptable: nil)] }
  end
end
