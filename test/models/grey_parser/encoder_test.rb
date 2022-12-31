require "test_helper"

class EncoderTest < ActiveSupport::TestCase
  test "divide should divide" do
    str = "abcdefghi"

    assert_equal ["ab", "cd", "ef", "gh", "i"], GreyParser::Encoder.divide(str, 2)
    assert_equal ["abcdefghi"], GreyParser::Encoder.divide(str, 50)
  end

  test "encode should encode" do
    lzw = ["T", "O", "B", "E", "O", "R", "N", "O", "T", 256, 258, 260, 265, 259, 261, 263]

    assert_equal ["1010100", "1001111", "1000010", "1000101", "1001111", "1010010", "1001110", "1001111", "1010100", "100000000", "100000010", "100000100", "100001001", "100000011", "100000101", "100000111"], GreyParser::Encoder.encode(lzw, step: 1)

    assert_equal ["001010100", "001001111", "001000010", "001000101", "001001111", "001010010", "001001110", "001001111", "001010100", "100000000", "100000010", "100000100", "100001001", "100000011", "100000101", "100000111"], GreyParser::Encoder.encode(lzw, step: 2)

    assert_equal "001010100001001111001000010001000101001001111001010010001001110001001111001010100100000000100000010100000100100001001100000011100000101100000111000", GreyParser::Encoder.encode(lzw, step: 3)

    assert_equal ["0001001", "0000011", "0010101", "0000100", "1111001", "0000100", "0100010", "1001001", "1110010", "1001000", "1001110", "0010011", "1100101", "0100100", "0000001", "0000001", "0100000", "1001000", "0100110", "0000011", "1000001", "0110000", "0111000"], GreyParser::Encoder.encode(lzw, step: 4)

    assert_equal [57, 51, 76, 52, 187, 52, 89, 139, 180, 138, 144, 74, 167, 97, 49, 49, 87, 138, 99, 51, 131, 109, 117], GreyParser::Encoder.encode(lzw, step: 5)

    # commented due to grey hack char() not behaving the same way a .ord or .bytes
    # r = "93L4»4Y�´��J§a11W�c3�mu".chars.map do |s|
    #   s.bytes
    # end
    # p r
    # p GreyParser::Encoder.encode(lzw).chars.map { |s| s.ord }
    #
    # assert_equal "93L4»4Y�´��J§a11W�c3�mu", GreyParser::Encoder.encode(lzw)
  end
end
