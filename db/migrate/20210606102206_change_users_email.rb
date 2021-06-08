# frozen_string_literal: true

class ChangeUsersEmail < ActiveRecord::Migration[6.1]
  def change
    change_column :users, :email, :string, null: false
  end
end
