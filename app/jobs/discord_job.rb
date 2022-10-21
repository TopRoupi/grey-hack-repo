# frozen_string_literal: true

class DiscordJob < ApplicationJob
  include Rails.application.routes.url_helpers

  queue_as :default

  def perform(obj)
    return if Rails.env != "production"

    announce_build(obj) if obj.instance_of?(Build)
    announce_post(obj) if obj.instance_of?(Post)
  end

  private

  def announce_post(post)
    return if post.visibility != "public"

    url = post_url(post, only_path: false, host: "www.greyrepo.xyz")

    Discord::Notifier.message("new post published: #{url}")
  end

  def announce_build(build)
    return if build.post.visibility != "public" || build.post.published != true

    url = post_url(build.post, only_path: false, host: "www.greyrepo.xyz")

    Discord::Notifier.message("new #{build.post.title} build #{build.name} published: #{url}")
  end
end
