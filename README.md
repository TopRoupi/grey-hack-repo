![](https://i.imgur.com/imxw85B.png)

# Description

scripts repository for the [greyhack](https://store.steampowered.com/app/605230/Grey_Hack/) game

# Repo website
https://greyrepo.xyz

# REQUIREMENTS


* Ruby version

  ```
  3.1.0
  ```

* System dependencies

  ```
  Postgresql 12
  ```

* Configuration

in development there is no other configuration required other than the database.yml in /config

in production aws s3 configs in /config/storage.yml and mailer provider in /config/enviroments/production.rb are required


* Database setup

  ```sh
  rails db:create
  rails db:migrate
  rails db:seed
  ```

* How to run the test suite

  ```sh
  rails test
  ```

* Run linters

  ```sh
    bundle exec standardrb --fix .
    bundle exec magic_frozen_string_literal .
  ```

# todo list (in no particular order)

add privacy scopes (public private not_listed) to post.

add import feature to post scripts, upload a folder/zip in your computer and convert its .src files into a Fileable.

add a build/releases system to posts/fileable, to replace the script_v1.src script_v2.src in the posts files.

add a guild system.

add a banks repo system.

add a ips repo system.

add search

maybe add a better way to rank posts popularity by downloads/scripts copies/views

add notifications when a user posts a comment in one of your scripts