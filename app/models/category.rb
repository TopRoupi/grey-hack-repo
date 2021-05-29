# frozen_string_literal: true

class Category < ApplicationRecord
  has_many :posts, through: :post_categories
  has_many :post_categories
end
