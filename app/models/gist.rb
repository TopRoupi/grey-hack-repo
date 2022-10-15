# == Schema Information
#
# Table name: gists
#
#  id          :bigint           not null, primary key
#  name        :string
#  description :string
#  user_id     :bigint
#  anonymous   :boolean          default(TRUE), not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  slug        :string
#
class Gist < ApplicationRecord
  extend FriendlyId

  belongs_to :user, optional: true
  has_many :scripts, as: :scriptable, dependent: :destroy

  accepts_nested_attributes_for :scripts, allow_destroy: true

  validates :name, presence: true, length: {minimum: 3, maximum: 32}
  validates :description, length: {maximum: 230}
  validates :scripts, length: {minimum: 1}

  friendly_id :name, use: :slugged

  def author
    if anonymous?
      User.anonymous_user
    else
      user || User.anonymous_user
    end
  end
end
