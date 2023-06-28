#!/bin/sh

set -e

# If running the rails server then create or migrate existing database
# if [ "${*}" == "./bin/rails server" ]; then
#   ./bin/rails db:prepare
# fi
#
# exec "${@}"


if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

# bundle exec rails assets:precompile

bundle exec rails db:prepare

bundle exec rails s -b 0.0.0.0
