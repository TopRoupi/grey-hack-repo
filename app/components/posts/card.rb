# frozen_string_literal: true

class Posts::Card < ApplicationComponent
  def initialize(post:, current_user:)
    @current_user = current_user
    @post = post
    # @build = @post.builds.published.last
    # p @post.builds.published.last
    # @build = @post.builds.select(&:published).sort_by(&:created_at).last
    puts "SFESFESSSSSSSSSSSSSSSSSSSSSSSWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwWWWWWWWWWWWWWWWWWWWWWWWWWWWWWeager"
    p @post.builds
    p @post.builds.published
    p @post.builds.published.last
    @build = @post.builds.published.last
  end
end
