FROM ruby:3.2.0-alpine

ENV BUNDLER_VERSION=2.4.4

ENV BUILD_ENV=true

ENV RAILS_ENV=production

ENV SECRET_KEY_BASE=dummy

RUN apk add --update --no-cache \
      binutils-gold \
      build-base \
      curl \
      file \
      g++ \
      gcc \
      git \
      less \
      libstdc++ \
      libffi-dev \
      libc-dev \ 
      linux-headers \
      libxml2-dev \
      libxslt-dev \
      libgcrypt-dev \
      make \
      netcat-openbsd \
      nodejs \
      openssl \
      pkgconfig \
      postgresql-dev \
      tzdata \
      yarn 

#TODO: use env var here
RUN gem install bundler -v 2.4.4

WORKDIR /app

COPY . ./ 

RUN bundle check || bundle install

RUN yarn install --check-files

# RUN ./bin/rails assets:precompile

ENTRYPOINT ["./entrypoints/docker-entrypoint.sh"]


