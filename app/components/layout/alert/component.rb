# frozen_string_literal: true

class Layout::Alert::Component < ApplicationComponent
  def initialize(text, type: :error)
    @text = text
    case type
    when :error
      @class = "bg-red-700 border-l-4 border-red-900 text-white"
    when :info
      @class = "bg-blue-500 border-l-4 border-blue-900 text-white"
    end
  end
end
