# frozen_string_literal: true

class Posts::Card::Component < ApplicationComponent
  def initialize(post:, current_user:)
    @current_user = current_user
    @post = post
  end
end
