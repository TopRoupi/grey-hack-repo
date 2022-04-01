# frozen_string_literal: true

class Comments::List::Component < ApplicationComponent
  def initialize(user:, commentable:, comments: nil)
    @comments = comments || commentable.comments.sort_by(&:created_at)
    @commentable = commentable
    @user = user
  end
end
