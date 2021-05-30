# frozen_string_literal: true

class Posts::Card::Component < ApplicationComponent
  def initialize(post:)
    @post = post
  end
end
