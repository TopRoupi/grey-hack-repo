class AddPublishedToBuilds < ActiveRecord::Migration[7.0]
  def change
    add_column :builds, :published, :boolean, null: false, default: false
  end
end
