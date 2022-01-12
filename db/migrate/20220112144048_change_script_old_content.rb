class ChangeScriptOldContent < ActiveRecord::Migration[7.0]
  def up
    remove_columns :scripts, :old_content
    add_column :scripts, :old_content, :binary
  end

  def down
    remove_columns :scripts, :old_content
    add_column :scripts, :old_content, :string
  end
end
