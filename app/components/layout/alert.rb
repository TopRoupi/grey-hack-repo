# frozen_string_literal: true

class Layout::Alert < ApplicationComponent
  def initialize(text, type: :success)
    @text = text
    case type
    when :error
      @class = "alert alert-error shadow-lg"
    when :info
      @class = "alert alert-info shadow-lg"
    when :success
      @class = "alert alert-success shadow-lg"
    end
  end
end
