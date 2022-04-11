# frozen_string_literal: true

class Post < ApplicationRecord
  include ActionText::Attachable
  extend FriendlyId

  belongs_to :user
  belongs_to :category
  has_rich_text :readme
  has_many :stars, as: :starable, dependent: :destroy
  has_many :comments, as: :commentable, dependent: :destroy
  has_many :builds, dependent: :destroy
  enum visibility: [:public, :not_listed, :private], _suffix: true
  friendly_id :title, use: :slugged

  accepts_nested_attributes_for :builds, allow_destroy: true

  validates :title, presence: true, length: {minimum: 3, maximum: 32}
  validates :summary, presence: true, length: {minimum: 6, maximum: 230}
  validates :readme, length: {maximum: 50_000}

  # default_scope -> { published }
  scope :published, -> { where(published: true) }
  scope :unpublished, -> { where(published: false) }
  scope :search, ->(query) {
    query = sanitize_sql_like(query)
    where(arel_table[:title].matches("%#{query}%"))
      .or(where(arel_table[:summary].matches("%#{query}%")))
  }
  scope :eager, -> { eager_load(:category, :user, stars: [:user]) }
  scope :asc, -> { order(created_at: :desc) }
  scope :week, -> { where({created_at: (1.week.ago)..Time.now}) }
  scope :month, -> { where({created_at: (1.month.ago)..Time.now}) }
  scope :year, -> { where({created_at: (1.year.ago)..Time.now}) }
end
