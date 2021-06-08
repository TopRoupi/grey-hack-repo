# frozen_string_literal: true

class CreateStars < ActiveRecord::Migration[6.1]
  def change
    create_table :stars do |t|
      t.belongs_to :user, null: false, foreign_key: true
      t.belongs_to :starable, polymorphic: true, null: false

      t.timestamps
    end
  end
end
