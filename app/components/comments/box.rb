# frozen_string_literal: true

class Comments::Box < ApplicationComponent
  def initialize(user:, commentable:, comments:)
    @user = user
    @commentable = commentable
    @comments = comments
  end
end
