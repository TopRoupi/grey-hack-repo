# frozen_string_literal: true

class Post < ApplicationRecord
  include Fileable

  belongs_to :user
  belongs_to :category # , through: :post_categories
  has_many :post_categories
  has_rich_text :readme
  has_many :stars, as: :starable, dependent: :destroy
  has_many :comments, as: :commentable

  validates :title, presence: true, length: {minimum: 3, maximum: 32}
  validates :summary, presence: true, length: {minimum: 6, maximum: 230}
  validates :readme, length: {maximum: 50_000}

  accepts_nested_attributes_for :scripts, allow_destroy: true

  # default_scope -> { eager.asc }
  scope :eager, -> { eager_load(:category, :user, stars: [:user]) }
  scope :asc, -> { order(created_at: :desc) }
  scope :week, -> { where({created_at: (1.week.ago)..Time.now}) }
  scope :month, -> { where({created_at: (1.month.ago)..Time.now}) }
  scope :year, -> { where({created_at: (1.year.ago)..Time.now}) }
end
