# frozen_string_literal: true

class DecipherReflex < ApplicationReflex
  def deciphe(value)
    @result = PASSWORDS[value] || "no result"
  end
end
