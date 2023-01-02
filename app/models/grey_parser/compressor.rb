# frozen_string_literal: true

class GreyParser::Compressor
  def self.compress(string)
    compressed = GreyParser::Lzw.compress(string)
    GreyParser::Encoder.encode(compressed)
  end

  def self.decompress(string)
    decoded = GreyParser::Encoder.decode(string)
    GreyParser::Lzw.decompress(decoded)
  end
end
