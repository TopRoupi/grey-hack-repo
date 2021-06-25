class AddNameToScripts < ActiveRecord::Migration[6.1]
  def change
    add_column :scripts, :name, :string
  end
end
