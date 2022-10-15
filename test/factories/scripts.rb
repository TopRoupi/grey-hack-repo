# frozen_string_literal: true

# == Schema Information
#
# Table name: scripts
#
#  id                  :bigint           not null, primary key
#  content             :string
#  highlighted_content :string
#  lib                 :boolean
#  name                :string
#  old_content         :binary
#  scriptable_type     :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  scriptable_id       :bigint
#
# Indexes
#
#  index_scripts_on_scriptable  (scriptable_type,scriptable_id)
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
