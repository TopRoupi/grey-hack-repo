# myapp.rb
require "sinatra"

get "/" do
  "Hello world!"
end

# `bundle exec sidekiq -e production -C config/sidekiq.yml`
Thread.new do
  `bundle exec sidekiq -e production -C config/sidekiq.yml`
end
