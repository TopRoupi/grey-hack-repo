class AddAlignmentToGuilds < ActiveRecord::Migration[7.0]
  def change
    add_column :guilds, :alignment, :integer, default: 1
  end
end
