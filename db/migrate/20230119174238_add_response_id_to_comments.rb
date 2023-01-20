class AddResponseIdToComments < ActiveRecord::Migration[7.0]
  def change
    add_column :comments, :response_id, :bigint
  end
end
