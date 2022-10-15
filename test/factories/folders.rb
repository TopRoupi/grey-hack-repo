# frozen_string_literal: true

# == Schema Information
#
# Table name: folders
#
#  id            :bigint           not null, primary key
#  foldable_type :string           not null
#  name          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  foldable_id   :bigint           not null
#
# Indexes
#
#  index_folders_on_foldable  (foldable_type,foldable_id)
#
FactoryBot.define do
  factory :folder do
    for_build

    trait :for_build do
      association(:foldable, factory: :build)
    end

    name { "folder" }
    scripts { [build(:script, scriptable: nil)] }
  end
end
