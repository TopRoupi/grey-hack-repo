# frozen_string_literal: true

class CreateGameVersions < ActiveRecord::Migration[6.1]
  def change
    create_table :game_versions do |t|
      t.string :version

      t.timestamps
    end
  end
end
