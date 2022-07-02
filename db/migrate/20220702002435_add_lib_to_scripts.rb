class AddLibToScripts < ActiveRecord::Migration[7.0]
  def change
    add_column :scripts, :lib, :boolean
  end
end
