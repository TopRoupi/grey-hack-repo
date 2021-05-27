class CreateReadmes < ActiveRecord::Migration[6.1]
  def change
    create_table :readmes do |t|
      t.belongs_to :post, null: false, foreign_key: true
      t.string :content

      t.timestamps
    end
  end
end
