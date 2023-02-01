# frozen_string_literal: true

class Comments::Form::Component < ApplicationComponent
  def initialize(user:, commentable:, comment: Comment.new, responding: nil)
    @user = user
    @comment = comment
    @responding = responding
    @commentable = commentable
  end
end
