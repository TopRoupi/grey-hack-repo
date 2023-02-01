# frozen_string_literal: true

# == Schema Information
#
# Table name: posts
#
#  id          :bigint           not null, primary key
#  description :string
#  published   :boolean          default(FALSE), not null
#  readme      :string
#  slug        :string
#  stars_count :integer          default(0)
#  summary     :string
#  title       :string
#  visibility  :integer          default("public")
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :bigint
#  user_id     :bigint           not null
#
# Indexes
#
#  index_posts_on_category_id  (category_id)
#  index_posts_on_slug         (slug) UNIQUE
#  index_posts_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (user_id => users.id)
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
