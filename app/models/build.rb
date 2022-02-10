class Build < ApplicationRecord
  belongs_to :post
  include Fileable
end
