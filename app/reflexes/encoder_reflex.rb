# frozen_string_literal: true

class EncoderReflex < ApplicationReflex
  def decompress(params)
    string = params["string"]
    morph :nothing

    begin
      self.payload = GreyParser::Compressor.decompress(string)
    rescue
      self.payload = "ERROR"
    end
  end

  def compress(params)
    string = params["string"]
    morph :nothing

    self.payload = GreyParser::Compressor.compress(string)
  end
end
