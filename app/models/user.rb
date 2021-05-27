# frozen_string_literal: true

class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :rememberable

  validates :name, length: {maximum: 32, minimum: 3}, presence: true, uniqueness: true
  validates :password, length: {maximum: 32}, presence: true
end
