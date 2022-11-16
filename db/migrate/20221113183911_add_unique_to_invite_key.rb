class AddUniqueToInviteKey < ActiveRecord::Migration[7.0]
  def change
    add_index :invites, :key, unique: true
  end
end
