![](https://i.imgur.com/vd6YR7m.png)

# Description

scripts repository for the [greyhack](https://store.steampowered.com/app/605230/Grey_Hack/) game

## Main Features

project files can be parsed to a string, and then used inside the game to quickly build all the files, without copy and pasting.

feature preview:
[![IMAGE ALT TEXT](http://img.youtube.com/vi/oUzte-doaPo/0.jpg)](http://www.youtube.com/watch?v=oUzte-doaPo "Video Title")

# Repo website

https://www.greyrepo.xyz

# REQUIREMENTS

* Ruby version

  ```
  3.1.1
  ```

* System dependencies

  ```
  Postgresql 12
  ```

* Configuration

  in development there is no other configuration required other than the database.yml in /config

  in production

  - aws s3 configs in /config/storage.yml
  - mailer provider and session_cache_store in /config/enviroments/production.rb
  - action cable redis in /config/cable.yml
  - sidekiq redis in /config/initializers/sidekiq.rb
  - pay(gem) credetials configuration for stripe


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

* backup database

  ```sh
    PGPASSWORD=PASSWORD pg_dump -F c -v -h HOSTNAME -U USERNAME -p PORT -d DATABASE -f backup.psql

    PGPASSWORD=PASSWORD pg_restore -c -C -F c -v -U USERNAME -h HOSTNAME -p PORT -d DATABASE backup.psql
  ```

# todo list (in no particular order)

add import feature to post scripts, upload a folder/zip in your computer and convert its .src files into a Fileable. (DONE)

add a build/releases system to posts/fileable, to replace the script_v1.src script_v2.src in the posts files. (DONE)

add a guild system.

add a banks repo system.

add a ips repo system.

maybe add a better way to rank posts popularity by downloads/scripts copies/views

