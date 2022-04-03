# frozen_string_literal: true

class Posts::InlineCard < ApplicationComponent
  def initialize(post:)
    @post = post
  end
end
