class CreateGuilds < ActiveRecord::Migration[7.0]
  def change
    create_table :guilds do |t|
      t.belongs_to :user, null: true, foreign_key: true
      t.string :name
      t.string :description
      t.text :avatar_data
      t.text :badge_data
      t.text :banner_data
      t.integer :registration, default: 0
      t.string :registration_info

      t.timestamps
    end
  end
end
