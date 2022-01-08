# frozen_string_literal: true

class CreateFolders < ActiveRecord::Migration[7.0]
  def change
    create_table :folders do |t|
      t.references :foldable, polymorphic: true, null: false
      t.string :name

      t.timestamps
    end
  end
end
