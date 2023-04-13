class AddExportStringToBuilds < ActiveRecord::Migration[7.0]
  def change
    add_column :builds, :preprocessed_export_string, :text
  end
end
