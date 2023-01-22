class AddTagToGuilds < ActiveRecord::Migration[7.0]
  def change
    add_column :guilds, :tag, :string
  end
end
