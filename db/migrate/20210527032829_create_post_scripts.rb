class CreatePostScripts < ActiveRecord::Migration[6.1]
  def change
    create_table :post_scripts do |t|
      t.belongs_to :post, null: false, foreign_key: true
      t.belongs_to :game_version, null: false, foreign_key: true
      t.string :content

      t.timestamps
    end
  end
end
