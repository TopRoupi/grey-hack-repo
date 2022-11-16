class CreateGuildsUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :guilds_users do |t|
      t.belongs_to :guild, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
