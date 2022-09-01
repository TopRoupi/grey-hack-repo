# frozen_string_literal: true

class Scripts::Card::Component < ApplicationComponent
  def initialize(script:)
    @script = script
  end
end
