class CreateGists < ActiveRecord::Migration[7.0]
  def change
    create_table :gists do |t|
      t.string :name
      t.string :description
      t.belongs_to :user, null: true, foreign_key: true
      t.boolean :anonymous, null: false, default: true

      t.timestamps
    end
  end
end
