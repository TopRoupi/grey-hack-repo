# == Schema Information
#
# Table name: gists
#
#  id          :bigint           not null, primary key
#  anonymous   :boolean          default(TRUE), not null
#  description :string
#  name        :string
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :bigint
#
# Indexes
#
#  index_gists_on_slug     (slug) UNIQUE
#  index_gists_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Gist < ApplicationRecord
  extend FriendlyId

  belongs_to :user, optional: true
  has_many :scripts, as: :scriptable, dependent: :destroy

  accepts_nested_attributes_for :scripts, allow_destroy: true

  validates :name, presence: true, length: {minimum: 3, maximum: 32}
  validates :description, length: {maximum: 230}
  validates :scripts, length: {minimum: 1}

  scope :search, ->(query) {
    query = sanitize_sql_like(query)
    where(arel_table[:name].matches("%#{query}%"))
      .or(where(arel_table[:description].matches("%#{query}%")))
  }

  scope :not_anonymous, -> { where(anonymous: false) }

  friendly_id :name, use: :slugged

  def author
    if anonymous?
      User.anonymous_user
    else
      user || User.anonymous_user
    end
  end
end
