# frozen_string_literal: true

class AddOldContentToScripts < ActiveRecord::Migration[6.1]
  def change
    add_column :scripts, :old_content, :string
  end
end
