# frozen_string_literal: true

class Comments::List::Component < ApplicationComponent
  def initialize(commentable:, comments: nil)
    @comments = comments || commentable.comments.sort_by(&:created_at)
    @commentable = commentable
  end
end
