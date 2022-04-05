# frozen_string_literal: true

class Comments::List < ApplicationComponent
  def initialize(user:, commentable:, comments: nil)
    @comments = comments || commentable.comments.order(:created_at)
    @commentable = commentable
    @user = user
  end
end
