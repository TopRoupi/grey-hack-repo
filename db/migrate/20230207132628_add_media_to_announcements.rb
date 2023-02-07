class AddMediaToAnnouncements < ActiveRecord::Migration[7.0]
  def change
    add_column :announcements, :media_data, :text
  end
end
