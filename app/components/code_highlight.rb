# frozen_string_literal: true

class CodeHighlight < ApplicationComponent
  def initialize(code:, extension: nil)
    @code = code
    @extension = extension&.to_sym || :txt
  end
end
