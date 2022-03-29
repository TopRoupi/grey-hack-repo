# frozen_string_literal: true

class Comments::Form::Component < ApplicationComponent
  def initialize(user:, comment: Comment.new)
    @user = user
    @comment = comment
  end
end
