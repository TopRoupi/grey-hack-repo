# frozen_string_literal: true

class AddDescriptionToCategories < ActiveRecord::Migration[6.1]
  def change
    add_column :categories, :description, :string
  end
end
