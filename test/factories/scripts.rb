FactoryBot.define do
  factory :script do
    association :post
    content { Faker::Lorem.characters(number: 500) }
  end
end
