# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :rememberable
  extend FriendlyId
  friendly_id :name

  validates :name, length: {maximum: 16, minimum: 3}, presence: true, uniqueness: true, format: {with: /(^[\d\w-]*$)/, message: "name can only include letters numbers and _ -"}
  # validates :password, length: {minimum: 6, maximum: 32}, presence: true
  # validates :btc, length: {minimum: 2, maximum: 32}, presence: false
  # validates :bank, length: {is: 8}, presence: false
  has_many :posts
end
