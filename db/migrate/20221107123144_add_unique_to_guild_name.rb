class AddUniqueToGuildName < ActiveRecord::Migration[7.0]
  def change
    add_index :guilds, :name, unique: true
  end
end
