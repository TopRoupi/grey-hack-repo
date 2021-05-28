class AddCategoryToPost < ActiveRecord::Migration[6.1]
  def change
    add_reference :posts, :category, index: true, foreign_key: true
  end
end
