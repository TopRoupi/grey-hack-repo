# frozen_string_literal: true

class PostValidator < ActiveModel::Validator
  def validate(record)
    if record.scripts.blank?
      record.errors.add(:scripts, "shall have at list 1 script")
    end
  end
end

class Post < ApplicationRecord
  belongs_to :user
  belongs_to :category # , through: :post_categories
  has_many :post_categories
  has_many :scripts, dependent: :destroy
  has_rich_text :readme
  has_many :stars, as: :starable, dependent: :destroy
  has_many :comments, as: :commentable

  validates :title, presence: true, length: {minimum: 3, maximum: 32}
  validates :summary, presence: true, length: {minimum: 6, maximum: 230}
  validates :readme, length: {maximum: 50_000}

  validates_with PostValidator

  accepts_nested_attributes_for :scripts
end
