# frozen_string_literal: true

class AddRecoverableFieldsToUsers < ActiveRecord::Migration[7.0]
  def change
    add_column :users, :reset_password_token, :string
    add_column :users, :reset_password_sent_at, :datetime
  end
end
