# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  name                   :string           not null
#  bank                   :string
#  btc                    :string
#  encrypted_password     :string           default(""), not null
#  remember_created_at    :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  email                  :string           not null
#  avatar                 :string
#  confirmation_token     :string
#  confirmed_at           :datetime
#  confirmation_sent_at   :datetime
#  unconfirmed_email      :string
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  admin                  :boolean
#  provider               :string
#  uid                    :string
#  supporter              :boolean
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
