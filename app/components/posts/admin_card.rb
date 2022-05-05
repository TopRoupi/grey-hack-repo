# frozen_string_literal: true

class Posts::AdminCard < ApplicationComponent
  def initialize(post:)
    @post = post
  end
end
