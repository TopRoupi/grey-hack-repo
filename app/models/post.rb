# frozen_string_literal: true

# == Schema Information
#
# Table name: posts
#
#  id          :bigint           not null, primary key
#  description :string
#  lib         :boolean
#  published   :boolean          default(FALSE), not null
#  readme      :string
#  slug        :string
#  stars_count :integer          default(0)
#  summary     :string
#  title       :string
#  visibility  :integer          default("public")
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  category_id :bigint
#  user_id     :bigint           not null
#
# Indexes
#
#  index_posts_on_category_id  (category_id)
#  index_posts_on_slug         (slug) UNIQUE
#  index_posts_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (category_id => categories.id)
#  fk_rails_...  (user_id => users.id)
#
class PostValidator < ActiveModel::Validator
  def validate(record)
    published_builds = record.builds.select { |b| b.published == true }
    if record.published == true && published_builds.size == 0
      record.errors.add(:builds, "a published post should have at least one published build")
    end
  end
end

class Post < ApplicationRecord
  include ActionText::Attachable
  extend FriendlyId
  validates_with PostValidator

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
  scope :eager, -> { includes(:category, :user, stars: [:user], builds: [:scripts, folders: [:scripts, :folders]]) }
  scope :asc, -> { order(created_at: :desc) }
  scope :week, -> { where({created_at: (1.week.ago)..Time.now}) }
  scope :month, -> { where({created_at: (1.month.ago)..Time.now}) }
  scope :year, -> { where({created_at: (1.year.ago)..Time.now}) }
end
