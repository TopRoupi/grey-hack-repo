# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  admin                  :boolean
#  avatar                 :string
#  bank                   :string
#  banner_data            :text
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
class User < ApplicationRecord
  pay_customer
  extend FriendlyId

  devise :database_authenticatable, :registerable, :rememberable, :validatable, :confirmable, :recoverable, :omniauthable, omniauth_providers: [:github]
  friendly_id :name

  validates :name, length: {maximum: 16, minimum: 3}, presence: true, uniqueness: true, format: {with: /(^[\d\w-]*$)/, message: "name can only include letters numbers and _ -"}
  # validates :password, length: {minimum: 6, maximum: 32}, presence: true
  validates :btc, length: {minimum: 2, maximum: 32, allow_blank: true}
  validates :bank, length: {is: 8, allow_blank: true}

  has_many :posts, dependent: :destroy
  has_many :gists, dependent: :destroy
  has_many :stars, dependent: :destroy
  has_many :starable_posts, through: :stars, source: "starable", source_type: "Post"
  has_many :comments, dependent: :destroy
  has_many :notifications, as: :recipient
  has_one_attached :nft, dependent: :destroy

  include ImageUploader::Attachment(:banner)

  after_commit :set_nft, on: [:create]

  def set_nft
    NftJob.perform_later(self)
  end

  def supporter?
    return true if supporter == true
    set_payment_processor :stripe
    # payment_processor.charges.where(processor_plan: SupporterBadge.price).any?
    payment_processor.charges.any?
  end

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.email = auth.info.email
      user.password = Devise.friendly_token[0, 8]
      user.name = auth.info.nickname
      user.avatar = auth.info.image

      user.skip_confirmation!
    end
  end

  def link_github(auth)
    if User.find_by(provider: auth.provider, uid: auth.uid).nil?
      update(provider: auth.provider, uid: auth.uid)
      true
    end
  end

  def self.anonymous_user
    OpenStruct.new(
      name: "anonymous",
      avatar: "https://i.imgur.com/LHv2STe.png",
      email: "bob.shadow@gmail.com"
    )
  end
end
