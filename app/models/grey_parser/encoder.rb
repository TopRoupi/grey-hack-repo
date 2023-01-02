# frozen_string_literal: true

class GreyParser::Encoder
  @@char_set = []
  @@char_set << (48..57).to_a # numbers
  @@char_set << (65..90).to_a # capital_letters
  @@char_set << (97..122).to_a # letters
  @@char_set << (128..193).to_a # extended
  @@char_set.flatten!

  def self.divide(s, n)
    offset = 0
    r = []

    loop do
      r << s[0...n]
      s = s[n..-1]

      break if s.blank?
    end

    r
  end

  def self.encode(lzw, step: nil)
    l = lzw.dup
    cell_size = 0

    l.map! do |e|
      e = e.ord if e.is_a? String
      e = e.to_s(2)
      cell_size = e.size if e.size > cell_size
      e
    end

    return l if step == 1

    l.map! do |e|
      "0" * (cell_size - e.size) + e
    end

    return l if step == 2

    l = l.join
    fat_added = l.size % 7
    fat_added = 7 - fat_added if fat_added > 0
    l += "0" * fat_added

    return l if step == 3

    fat_bin = fat_added.to_s(2)
    l = "0" * (7 - fat_bin.size) + fat_bin + l

    cell_bin = cell_size.to_s(2)
    l = "0" * (7 - cell_bin.size) + cell_bin + l

    l = divide(l, 7)

    return l if step == 4

    l.map! do |e|
      @@char_set[e.to_i(2)]
    end

    return l if step == 5

    l.map! do |e|
      e.chr("UTF-8")
    end

    l.join
  end

  def self.decode(string)
    l = string.chars

    l.map! do |e|
      e = @@char_set.index(e.ord).to_s(2)
      "0" * (7 - e.size) + e
    end

    l = l.join

    cell_size = l[0...7].to_i(2)
    fat_added = l[7...14].to_i(2)

    l = divide(l[14..], 7)

    l[-1] = l[-1][0...fat_added * -1] if fat_added > 0

    l = divide(l.join, cell_size)

    l.map! do |e|
      e = e.to_i(2)
      e = e.chr("UTF-8") if e < 256
      e
    end

    l
  end
end
