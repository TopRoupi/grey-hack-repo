# frozen_string_literal: true

class Post < ApplicationRecord
  belongs_to :user
  has_many :categories, through: :post_categories
  has_many :post_categories
  has_many :scripts

  accepts_nested_attributes_for :scripts
end
