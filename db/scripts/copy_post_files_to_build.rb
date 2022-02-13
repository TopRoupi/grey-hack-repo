require "rubygems"

Post.all.each do |post|
  build = Build.new name: "Main build", post: post
  post_scripts = Script.where(scriptable_type: "Post", scriptable_id: post.id)
  post_folders = Folder.where(foldable_type: "Post", foldable_id: post.id)
  build.scripts = post_scripts
  build.folders = post_folders
  build.save
end
