class CreateScripts < ActiveRecord::Migration[6.1]
  def change
    create_table :scripts do |t|
      t.belongs_to :post_script, null: false, foreign_key: true
      t.string :content

      t.timestamps
    end
  end
end
