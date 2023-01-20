# frozen_string_literal: true

class Comments::Form::Component < ApplicationComponent
  def initialize(user:, comment: Comment.new, responding: nil)
    @user = user
    @comment = comment
    @responding = responding
  end
end
