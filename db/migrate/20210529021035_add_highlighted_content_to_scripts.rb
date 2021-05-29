# frozen_string_literal: true

class AddHighlightedContentToScripts < ActiveRecord::Migration[6.1]
  def change
    add_column :scripts, :highlighted_content, :string
  end
end
