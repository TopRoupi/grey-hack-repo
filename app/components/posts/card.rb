# frozen_string_literal: true

class Posts::Card < ApplicationComponent
  def initialize(post:, current_user:)
    @current_user = current_user
    @post = post
    @build = @post.builds.select { |b| b.published == true }.last
  end
end
