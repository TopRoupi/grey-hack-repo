class AddBannerDataToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :banner_data, :text
  end
end
