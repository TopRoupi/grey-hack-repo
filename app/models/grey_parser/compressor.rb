# frozen_string_literal: true

class GreyParser::Compressor
  def self.compress(string)
    if string.ascii_only? == false
      return "ERROR: THIS FILE HAS NON ASCII CHARS AND CANNOT BE COMPRESSED"
    end
    compressed = GreyParser::Lzw.compress(string)
    GreyParser::Encoder.encode(compressed)
  end

  def self.decompress(string)
    decoded = GreyParser::Encoder.decode(string)
    GreyParser::Lzw.decompress(decoded)
  end
end
