# frozen_string_literal: true

class Layout::Alert < ApplicationComponent
  def initialize(text, type: :error)
    @text = text
    case type
    when :error
      @class = "bg-red-700 border-l-4 border-red-900 text-white"
    when :info
      @class = "bg-blue-600 border-l-4 border-blue-900 text-white"
    when :success
      @class = "bg-green-600 border-l-4 border-green-900 text-white"
    end
  end
end
