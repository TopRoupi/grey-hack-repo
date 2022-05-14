# frozen_string_literal: true

class BuildExplorer < ApplicationComponent
  def initialize(post:, selected_build: nil)
    @post = post
    @builds = @post.builds.published.order(created_at: :desc)
    @selected_build = selected_build || @builds.first
  end
end
