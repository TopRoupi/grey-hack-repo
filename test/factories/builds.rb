# frozen_string_literal: true

# == Schema Information
#
# Table name: builds
#
#  id         :bigint           not null, primary key
#  message    :string
#  name       :string
#  published  :boolean          default(FALSE), not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  post_id    :bigint           not null
#
# Indexes
#
#  index_builds_on_post_id  (post_id)
#
# Foreign Keys
#
#  fk_rails_...  (post_id => posts.id)
#
FactoryBot.define do
  factory :build do
    association :post
    scripts { [build(:script, scriptable: nil)] }
    name { Faker::Lorem.characters(number: 10) }
    published { true }
  end
end
