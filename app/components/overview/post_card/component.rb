# frozen_string_literal: true

class Overview::PostCard::Component < ApplicationComponent
  def initialize(post:)
    @post = post
  end
end
