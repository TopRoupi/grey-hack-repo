# frozen_string_literal: true

class Posts::Files::Component < ApplicationComponent
  def initialize(post:)
    @post = post
  end
end
