class Folder < ApplicationRecord
  include Fileable

  belongs_to :foldable, polymorphic: true

  validates :name, presence: true, length: {minimum: 2, maximum: 24}
end
