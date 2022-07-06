# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby ">= 3.1.1"

gem "rails", "~> 7.0.1"

gem "pg", "~> 1.1"
gem "puma", "~> 5.0"
gem "turbo-rails", "~> 0.5.9"
gem "jbuilder", "~> 2.7"
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'
# Use Active Storage variant
gem "image_processing", "~> 1.2"
# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", ">= 1.4.4", require: false
# Active storage provider
gem "aws-sdk-s3", "~> 1.112"
# Stimulus Reflex
gem "redis", "~> 4.0", require: ["redis", "redis/connection/hiredis"]
gem "hiredis", "~> 0.6.3"
gem "redis-session-store", "~> 0.11.4" # removing this causes sentry params filter to break even though redis sesssion store is disabled
# gem "ostruct", "~> 0.5.3" # delete this after stimulus_reflex gets updated from pre8
gem "stimulus_reflex", "~> 3.5.0-pre9"
# front end gems
gem "view_component-form"
gem "view_component", "~> 2.49"
gem "simple_form", "~> 5.1"
gem "meta-tags", "~> 2.16"
gem "octicons_helper", "~> 16.3"
gem "pagy", "~> 5.10"
# back end gems
gem "amoeba", "~> 3.2"
gem "omniauth-rails_csrf_protection"
gem "omniauth-github"
gem "discord-notifier", "~> 1.0", ">= 1.0.3"
gem "sidekiq", "~> 6.4"
gem "devise", "~> 4.8"
gem "noticed", "~> 1.5"
gem "friendly_id", "~> 5.4.0"
gem "rubyzip", "~> 2.3", require: "zip" # required by FileJob
gem "pay", "~> 3.0"
gem "stripe", ">= 5.0", "< 6.0"
# assets bundling
gem "jsbundling-rails", "~> 1.0"
gem "sprockets-rails"
gem "tailwindcss-rails", "~> 2.0"
# gem "cssbundling-rails", "~> 1.0"
# apm provider
gem "newrelic_rpm", "~> 8.4"
gem "sentry-ruby", "~> 5.2"
gem "sentry-rails", "~> 5.2"
gem "sentry-sidekiq", "~> 5.3"

gem "rpictogrify", git: "https://github.com/TopRoupi/rpictogrify.git", branch: "master"

group :development, :test do
  gem "byebug", platforms: [:mri, :mingw, :x64_mingw]
  gem "factory_bot_rails"
  gem "faker", git: "https://github.com/faker-ruby/faker.git", branch: "master"
  gem "rails-controller-testing"
end

group :development do
  gem "web-console", ">= 4.1.0"
  gem "rack-mini-profiler", "~> 2.0"
  gem "listen", "~> 3.3"
  gem "spring"
  gem "stackprof", "~> 0.2.19"
  gem "standardrb"
  gem "rubocop", "~> 1.29.1"
end

group :test do
  gem "capybara", ">= 3.26"
  gem "selenium-webdriver"
  gem "webdrivers"
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
