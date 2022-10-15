# frozen_string_literal: true

# == Schema Information
#
# Table name: categories
#
#  id          :bigint           not null, primary key
#  name        :string
#  icon        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  description :string
#
class Category < ApplicationRecord
  has_many :posts, through: :post_categories
  has_many :post_categories
  extend FriendlyId
  friendly_id :name
end
