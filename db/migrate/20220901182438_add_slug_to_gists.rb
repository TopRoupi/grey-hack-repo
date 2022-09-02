class AddSlugToGists < ActiveRecord::Migration[7.0]
  def change
    add_column :gists, :slug, :string
    add_index :gists, :slug, unique: true
  end
end
