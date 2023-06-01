![](https://i.imgur.com/ywT99ea.png)

# Repo website

https://www.greyrepo.xyz

# Description

scripts repository for the [greyhack](https://store.steampowered.com/app/605230/Grey_Hack/) game

# REQUIREMENTS

* Ruby version

  ```
  3.2.0
  ```

* System dependencies

  ```
  Postgresql
  redis
  stripe cli
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

* Development setup


  ```sh
    podman pull docker.io/library/postgres
    podman run -dt --name my-postgres -e POSTGRES_PASSWORD=postgres -v "/home/me/postgres_docker:/var/lib/postgresql/data:Z" -p 5432:5432 postgres

    psql -h localhost -U postgres -p 5432 -d postgres

    podman pull docker.io/redis
    podman run -d --name redis_server -p 6379:6379 redis
  ```



