class PostScript < ApplicationRecord
  belongs_to :post
  belongs_to :game_version
end
