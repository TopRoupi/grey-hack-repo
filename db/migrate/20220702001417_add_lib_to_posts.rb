class AddLibToPosts < ActiveRecord::Migration[7.0]
  def change
    add_column :posts, :lib, :boolean
  end
end
