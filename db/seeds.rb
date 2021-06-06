# frozen_string_literal: true

Category.create name: "Hacking", icon: "cpu"
Category.create name: "Snippets", icon: "code"
Category.create name: "Viruses", icon: "bug"
Category.create name: "Tools", icon: "tools"
Category.create name: "Utils", icon: "terminal"
Category.create name: "Others", icon: "number"

user = User.create name: "user", password: "123456", email: "aaaaaa@aaaaaa"

Category.all.each do |category|
  20.times do
    post = Post.new title: "test title #{category.name}", summary: "test post summary 123", category: category, user: user
    post.scripts << Script.new(content: 'print("lol"')
    post.save
  end
end
