class AddMessageToBuilds < ActiveRecord::Migration[7.0]
  def change
    add_column :builds, :message, :string
  end
end
