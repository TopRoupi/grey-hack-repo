# frozen_string_literal: true

class Scripts::Card::Component < ApplicationComponent
  def initialize(script:, first: false, last: false)
    @script = script

    @first = first
    @last = last
  end
end
