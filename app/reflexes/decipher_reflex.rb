# frozen_string_literal: true

class DecipherReflex < ApplicationReflex
  def deciphe(value)
    result = value.split("\n").map do |line|
      values = line.split(":")
      values[-1] = PASSWORDS[values[-1]] || values[-1]
      values.join(":")
    end.join("\n")
    morph "#result", result || "no result"
  end
end
