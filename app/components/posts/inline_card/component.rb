# frozen_string_literal: true

class Posts::InlineCard::Component < ApplicationComponent
  def initialize(post:)
    @post = post
  end
end
