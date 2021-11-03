# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.0.0"

gem "rails", "~> 7.0.0.alpha2"

gem "pg", "~> 1.1"
gem "puma", "~> 5.0"
gem 'sass-rails'
gem "turbo-rails", ">= 0.7.11"
gem "jbuilder", "~> 2.7"
# Use Active Model has_secure_password
# gem 'bcrypt', '~> 3.1.7'

gem "redis", "~> 4.0", require: ["redis", "redis/connection/hiredis"]
gem "hiredis"
gem "view_component"
gem "stimulus_reflex", "~> 3.5.0-pre1"
# gem "devise"
gem "devise", github: "strobilomyces/devise", branch: "patch-1"
gem "octicons_helper"
gem "friendly_id", "~> 5.4.0"

# Use Active Storage variant
gem "image_processing", "~> 1.2"

gem "jsbundling-rails"
gem 'cssbundling-rails'

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", ">= 1.4.4", require: false

gem "aws-sdk-s3", require: false

gem "hotwire-rails", "~> 0.1.3"
gem "simple_form", "~> 5.1"

group :development, :test do
  gem "byebug", platforms: [:mri, :mingw, :x64_mingw]
  gem "factory_bot_rails"
  gem "shoulda-context"
  gem "faker", git: "https://github.com/faker-ruby/faker.git", branch: "master"
end

group :development do
  gem "web-console", ">= 4.1.0"
  # gem "rack-mini-profiler", "~> 2.0"
  gem "listen", "~> 3.3"
  gem "spring"
end

group :test do
  gem "capybara", ">= 3.26"
  gem "selenium-webdriver"
  gem "webdrivers"
end

group :production do
  gem "rails_12factor"
end

gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem "pagy", "~> 4.9"
