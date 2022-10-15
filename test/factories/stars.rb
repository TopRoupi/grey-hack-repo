# frozen_string_literal: true

# == Schema Information
#
# Table name: stars
#
#  id            :bigint           not null, primary key
#  user_id       :bigint           not null
#  starable_type :string           not null
#  starable_id   :bigint           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
FactoryBot.define do
  factory :star do
    user { nil }
    starable { nil }
  end
end
