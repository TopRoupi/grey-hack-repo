class AddScriptableToScripts < ActiveRecord::Migration[7.0]
  def change
    add_reference :scripts, :scriptable, polymorphic: true
    reversible do |dir|
      dir.up { Script.update_all("scriptable_id = post_id, scriptable_type='Post'") }
      dir.down { Script.update_all("script_id = scriptable_id") }
    end
    remove_reference :scripts, :post, index: true, foreign_key: true
  end
end
