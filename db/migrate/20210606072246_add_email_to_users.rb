class AddEmailToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :email, :string, null: true, unique: true
    add_index :users, :name, unique: true
  end
end
