class Script < ApplicationRecord
  belongs_to :post

  validates :content, presence: true, length: {minimum: 10}
end
