# frozen_string_literal: true

class Scripts::Card::CopyButton::Component < ApplicationComponent
  def initialize(script:, **options)
    @script = script
    @class = options[:class]
  end
end
