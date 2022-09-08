class AddSupporterToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :supporter, :boolean
  end
end
