# frozen_string_literal: true

# == Schema Information
#
# Table name: categories
#
#  id          :bigint           not null, primary key
#  name        :string
#  icon        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  description :string
#
FactoryBot.define do
  factory :category do
    name { Faker::Lorem.characters(number: 15) }
    icon { "pencil" }
    description { Faker::Lorem.characters(number: 40) }
  end
end
