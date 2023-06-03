# frozen_string_literal: true

class Posts::Card < ApplicationComponent
  def initialize(post:, current_user:)
    @current_user = current_user
    @post = post
    # @build = @post.builds.published.last
    @build = @post.builds.select(&:published).sort_by(&:created_at).last
  end
end
