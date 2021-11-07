class Folder < ApplicationRecord
  include Fileable

  belongs_to :foldable, polymorphic: true
end
