# frozen_string_literal: true

class User < ApplicationRecord
  pay_customer
  extend FriendlyId
  has_many :notifications, as: :recipient

  devise :database_authenticatable, :registerable, :rememberable, :validatable, :confirmable, :recoverable
  friendly_id :name

  validates :name, length: {maximum: 16, minimum: 3}, presence: true, uniqueness: true, format: {with: /(^[\d\w-]*$)/, message: "name can only include letters numbers and _ -"}
  # validates :password, length: {minimum: 6, maximum: 32}, presence: true
  validates :btc, length: {minimum: 2, maximum: 32, allow_blank: true}
  validates :bank, length: {is: 8, allow_blank: true}

  has_many :posts, dependent: :destroy
  has_many :stars, dependent: :destroy
  has_many :starable_posts, through: :stars, source: "starable", source_type: "Post"
  has_many :comments, dependent: :destroy

  def supporter?
    set_payment_processor :stripe
    payment_processor.subscriptions.where(status: "active", processor_plan: SupporterSubscription.price).any?
  end
end
