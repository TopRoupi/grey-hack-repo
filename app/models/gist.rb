class Gist < ApplicationRecord
  belongs_to :user, optional: true
  has_many :scripts, as: :scriptable, dependent: :destroy

  accepts_nested_attributes_for :scripts, allow_destroy: true

  validates :name, presence: true, length: {minimum: 3, maximum: 32}
  validates :description, presence: true, length: {minimum: 6, maximum: 230}
  validates :scripts, length: {minimum: 1}

  def author
    if anonymous?
      User.anonymous_user
    else
      user
    end
  end
end
