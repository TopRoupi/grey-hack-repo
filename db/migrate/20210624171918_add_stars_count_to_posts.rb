# frozen_string_literal: true

class AddStarsCountToPosts < ActiveRecord::Migration[6.1]
  def change
    add_column :posts, :stars_count, :integer, default: 0
  end
end
