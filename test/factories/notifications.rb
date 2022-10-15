# frozen_string_literal: true

# == Schema Information
#
# Table name: notifications
#
#  id             :bigint           not null, primary key
#  recipient_type :string           not null
#  recipient_id   :bigint           not null
#  type           :string           not null
#  params         :jsonb
#  read_at        :datetime
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#
FactoryBot.define do
  factory :notification do
    recipient { nil }
    type { "" }
    params { "" }
    read_at { "2022-02-06 22:51:25" }
  end
end
