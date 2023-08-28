# frozen_string_literal: true

class GreyParser::Lzw
  def self.compress(uncompressed)
    dict_size = 256
    dictionary = Array.new(dict_size) { |i| [i.chr("UTF-8"), i.chr("UTF-8")] }.to_h

    w = ""
    result = []
    uncompressed.chars.each do |c|
      wc = w + c
      if dictionary.has_key?(wc)
        w = wc
      else
        result << dictionary[w]
        dictionary[wc] = dict_size
        dict_size += 1
        w = c
      end
    end

    result << dictionary[w] unless w.empty?
    result
  end

  def self.decompress(compressed)
    dict_size = 256
    dictionary = Array.new(dict_size) { |i| [i.chr("UTF-8"), i.chr("UTF-8")] }.to_h

    w = result = compressed.shift
    compressed.each do |k|
      if dictionary.has_key?(k)
        entry = dictionary[k]
      elsif k == dict_size
        entry = w + w[0, 1]
      else
        raise "Bad compressed k: #{k}"
      end
      result += entry

      dictionary[dict_size] = w + entry[0, 1]
      dict_size += 1

      w = entry
    end
    result
  end
end
