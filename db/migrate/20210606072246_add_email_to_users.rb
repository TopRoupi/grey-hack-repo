class AddEmailToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :email, :string, null: false, unique: true
    add_index :users, :name, unique: true
  end
end
