# frozen_string_literal: true

class Comments::Form::Component < ApplicationComponent
  def initialize(comment: Comment.new)
    @comment = comment
  end
end
