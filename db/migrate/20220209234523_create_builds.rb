class CreateBuilds < ActiveRecord::Migration[7.0]
  def change
    create_table :builds do |t|
      t.references :post, null: false, foreign_key: true
      t.string :name

      t.timestamps
    end
  end
end
