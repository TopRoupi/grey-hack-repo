# == Schema Information
#
# Table name: guilds
#
#  id                :bigint           not null, primary key
#  alignment         :integer          default("grey")
#  avatar_data       :text
#  badge_data        :text
#  banner_data       :text
#  description       :string
#  name              :string
#  registration      :integer          default("closed")
#  registration_info :string
#  slug              :string
#  tag               :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  user_id           :bigint           not null
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
  has_many :invites, dependent: :destroy
  has_many :announcements, dependent: :destroy
  has_many :guilds_users, dependent: :destroy
  has_many :members, through: :guilds_users, source: :user

  enum registration: [:closed, :external], _suffix: true
  include ImageUploader::Attachment(:avatar)
  include ImageUploader::Attachment(:banner)
  include ImageUploader::Attachment(:badge)

  validates :name, presence: true, length: {minimum: 3, maximum: 32}, uniqueness: true
  validates :description, presence: true, length: {maximum: 230}
  validates :registration_info, length: {maximum: 64}
  validates :tag, length: {maximum: 3, minimum: 3}, uniqueness: true, allow_blank: true
  enum alignment: [:white, :grey, :black], _suffix: true

  def all_members
    [admin].push(members.to_a).flatten
  end

  def display_name
    if tag.empty? == false
      "#{name} [#{tag}]"
    else
      name
    end
  end

  def admin
    user
  end
end
