# frozen_string_literal: true

class AddVisibilityToPosts < ActiveRecord::Migration[7.0]
  def change
    add_column :posts, :visibility, :integer, default: 0
  end
end
