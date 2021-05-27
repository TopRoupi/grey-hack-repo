# frozen_string_literal: true

class Post < ApplicationRecord
  belongs_to :user
  has_many :categories, through: :post_categories
end
