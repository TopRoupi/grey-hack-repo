# frozen_string_literal: true

# == Schema Information
#
# Table name: builds
#
#  id         :bigint           not null, primary key
#  post_id    :bigint           not null
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  published  :boolean          default(FALSE), not null
#
FactoryBot.define do
  factory :build do
    association :post
    scripts { [build(:script, scriptable: nil)] }
    name { Faker::Lorem.characters(number: 10) }
    published { true }
  end
end
