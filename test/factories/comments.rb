# frozen_string_literal: true

# == Schema Information
#
# Table name: comments
#
#  id               :bigint           not null, primary key
#  user_id          :bigint           not null
#  commentable_type :string           not null
#  commentable_id   :bigint           not null
#  content          :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
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
