# frozen_string_literal: true

class EncoderReflex < ApplicationReflex
  def decode(params)
    string = params["string"]
    puts "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
    puts string.chars.map { |e| e.ord }
  end
end
