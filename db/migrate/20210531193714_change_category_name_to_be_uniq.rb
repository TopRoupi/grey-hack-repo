# frozen_string_literal: true

class ChangeCategoryNameToBeUniq < ActiveRecord::Migration[6.1]
  def change
    change_column :categories, :name, :string, unique: true
  end
end
