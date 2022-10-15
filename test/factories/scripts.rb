# frozen_string_literal: true

# == Schema Information
#
# Table name: scripts
#
#  id                  :bigint           not null, primary key
#  content             :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  highlighted_content :string
#  name                :string
#  scriptable_type     :string
#  scriptable_id       :bigint
#  old_content         :binary
#  lib                 :boolean
#
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
