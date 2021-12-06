# frozen_string_literal: true

class Scripts::Card::Component < ApplicationComponent
  def initialize(script:, edit: false)
    @script = script
    @edit = edit
  end
end
