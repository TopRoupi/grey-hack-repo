# == Schema Information
#
# Table name: guilds
#
#  id                :bigint           not null, primary key
#  avatar_data       :text
#  badge_data        :text
#  banner_data       :text
#  description       :string
#  name              :string
#  registration      :integer          default("closed")
#  registration_info :string
#  slug              :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :bigint
#
# Indexes
#
#  index_guilds_on_name     (name) UNIQUE
#  index_guilds_on_slug     (slug) UNIQUE
#  index_guilds_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Guild < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged

  belongs_to :user

  enum registration: [:closed, :external], _suffix: true
  include ImageUploader::Attachment(:avatar)
  include ImageUploader::Attachment(:banner)
  include ImageUploader::Attachment(:badge)

  validates :name, presence: true, length: {minimum: 3, maximum: 16}, uniqueness: true
  validates :description, presence: true, length: {maximum: 230}
  validates :registration_info, length: {maximum: 64}
end
