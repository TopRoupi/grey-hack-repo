# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "~> 3.2.2"

gem "rails", "~> 7.0.8"

gem "pg", "~> 1.5"
gem "puma", "~> 6.3"
gem "turbo-rails", "~> 1.4.0"
gem "jbuilder", "~> 2.7"
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'
# Use Active Storage variant
gem "image_processing", "~> 1.2"
# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", ">= 1.4.4", require: false
# Active storage provider
gem "aws-sdk-s3", "~> 1.136"
# Stimulus Reflex
gem "redis", "~> 4.0", require: ["redis", "redis/connection/hiredis"]
gem "hiredis", "~> 0.6.3"
gem "redis-session-store", "~> 0.11.4" # removing this causes sentry params filter to break even though redis sesssion store is disabled
gem "stimulus_reflex", "= 3.5.0.rc4"
gem "cable_ready", "= 5.0.3"
# front end gems
gem "view_component-form"
gem "view_component", "~> 3.9"
gem "simple_form", "~> 5.1"
gem "meta-tags", "~> 2.16"
gem "octicons_helper", "~> 19.7"
gem "pagy", "~> 6.0"
gem "diffy", "~> 3.4"
gem "local_time", "~> 2.1"
gem "futurism", "~> 1.1"
# back end gems
gem "ahoy_matey"
gem "blazer"
gem "shrine", "~> 3.3"
gem "clockwork", "~> 3.0"
gem "dry-transaction", "~> 0.15.0"
gem "pundit", "~> 2.2"
gem "pghero", "~> 3.3"
gem "redcarpet", "~> 3.5"
gem "rpictogrify", "~> 0.5.0"
gem "amoeba", "~> 3.2"
gem "omniauth-rails_csrf_protection"
gem "omniauth-github"
gem "discord-notifier", "~> 1.0", ">= 1.0.3"
gem "sidekiq", "~> 7.2"
gem "devise", "~> 4.8"
gem "noticed", "~> 1.5"
gem "friendly_id", "~> 5.5.0"
gem "rubyzip", "~> 2.3", require: "zip" # required by FileJob
gem "pay", "~> 6.8"
# gem "stripe", ">= 8.0", "< 9.0"
# assets bundling
# gem "jsbundling-rails", "~> 1.0"
gem "sprockets-rails"
# gem "tailwindcss-rails", "~> 2.0"
gem "vite_rails"
# gem "cssbundling-rails", "~> 1.0"
# apm provider
gem "newrelic_rpm", "~> 9.5"
gem "sentry-ruby", "~> 5.2"
gem "sentry-rails", "~> 5.2"
gem "sentry-sidekiq", "~> 5.3"

gem "foreman", require: false

group :development, :test do
  gem "debug"
  gem "factory_bot_rails"
  gem "faker", git: "https://github.com/faker-ruby/faker.git", branch: "main"
  gem "rails-controller-testing"
  gem "annotate", git: "https://github.com/ctran/annotate_models.git"
  gem "simplecov"
end

group :development do
  gem "web-console", ">= 4.1.0"
  gem "rack-mini-profiler", "~> 3.1"
  gem "listen", "~> 3.3"
  gem "spring"
  gem "stackprof", "~> 0.2.19"
  gem "standardrb"
  gem "rubocop", "~> 1.56.4"
end

group :test do
  gem "capybara", ">= 3.26"
  gem "selenium-webdriver"
  gem "webdrivers"
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
