# frozen_string_literal: true

class Scripts::Card::Component < ApplicationComponent
  def initialize(script:, edit: false, index: nil)
    @script = script
    @edit = edit
    @index = index
  end
end
