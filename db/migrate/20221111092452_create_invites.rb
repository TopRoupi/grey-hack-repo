class CreateInvites < ActiveRecord::Migration[7.0]
  def change
    create_table :invites do |t|
      t.string :key, null: false
      t.belongs_to :guild, null: false, foreign_key: true
      t.belongs_to :user, null: false, foreign_key: true
      t.date :accepted_date

      t.timestamps
    end
  end
end
