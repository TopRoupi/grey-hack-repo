# frozen_string_literal: true

# == Schema Information
#
# Table name: posts
#
#  id          :bigint           not null, primary key
#  user_id     :bigint           not null
#  title       :string
#  description :string
#  summary     :string
#  readme      :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :bigint
#  stars_count :integer          default(0)
#  slug        :string
#  visibility  :integer          default("public")
#  published   :boolean          default(FALSE), not null
#  lib         :boolean
#
FactoryBot.define do
  factory :post do
    association :user
    association :category
    builds { [build(:build, post: nil, published: true)] }
    title { Faker::Lorem.characters(number: 15) }
    summary { Faker::Lorem.characters(number: 50) }
    readme { Faker::Lorem.characters(number: 200) }
    comments { [build(:comment, commentable: nil)] }
    published { true }
  end
end
