# frozen_string_literal: true

class DiscordJob < ApplicationJob
  include Rails.application.routes.url_helpers

  queue_as :default

  def perform(post)
    return if post.published == false || post.visibility != "public" || Rails.env != "production"

    url = post_url(post, only_path: false, host: "www.greyrepo.xyz")

    if post.builds.size == 1
      Discord::Notifier.message("new post published: #{url}")
    end
  end
end
