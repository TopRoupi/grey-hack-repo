# frozen_string_literal: true

Category.create name: "Scripts", icon: "file", description: "one file scripts, usually simple command line programs that provides some quality of life improvements, exemple: improved version of commands that already exists in the game"
Category.create name: "Programs", icon: "terminal", description: "programs with one or more files that do complex things, example: games, hacking tools, network mapping etc"
Category.create name: "Modules", icon: "code-square", description: "code snippets that can be imported in your program to speed development"

user = User.create name: "user", password: "123456", admin: true, email: "aaaaaa@aaaaaa", confirmed_at: Time.now
user = User.create name: "user2", password: "123456", email: "aaaaaa2@aaaaaa", confirmed_at: Time.now

Category.all.each do |category|
  20.times do
    post = Post.new title: "test title #{category.name}", summary: "test post summary 123", category: category, user: user
    build = Build.new(name: "Main build")
    build.scripts << Script.new(name: "script", content: 'print("lol"')
    post.builds << build
    post.save
  end
end
