# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  admin                  :boolean
#  avatar                 :string
#  bank                   :string
#  btc                    :string
#  confirmation_sent_at   :datetime
#  confirmation_token     :string
#  confirmed_at           :datetime
#  email                  :string           not null
#  encrypted_password     :string           default(""), not null
#  name                   :string           not null
#  provider               :string
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  supporter              :boolean
#  uid                    :string
#  unconfirmed_email      :string
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_confirmation_token  (confirmation_token) UNIQUE
#  index_users_on_name                (name) UNIQUE
#
FactoryBot.define do
  factory :user do
    name { Faker::Lorem.characters(number: 10) }
    password { Faker::Lorem.characters(number: 16) }
    bank { Faker::Lorem.characters(number: 8) }
    email { Faker::Lorem.characters(number: 8) + "@mail.com" }
    btc { Faker::Lorem.characters(number: 10) }
    confirmed_at { Time.now }
  end
end
