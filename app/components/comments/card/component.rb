# frozen_string_literal: true

class Comments::Card::Component < ApplicationComponent
  def initialize(comment:)
    @comment = comment
  end
end
