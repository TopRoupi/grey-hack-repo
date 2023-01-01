require "test_helper"

class LzwTest < ActiveSupport::TestCase
  test "should compress" do
    compressed = GreyParser::Lzw.compress("TOBEORNOTTOBEORTOBEORNOT")
    assert_equal compressed, ["T", "O", "B", "E", "O", "R", "N", "O", "T", 256, 258, 260, 265, 259, 261, 263]
  end

  test "should decompress" do
    decompressed = GreyParser::Lzw.decompress(["T", "O", "B", "E", "O", "R", "N", "O", "T", 256, 258, 260, 265, 259, 261, 263])
    assert_equal decompressed, "TOBEORNOTTOBEORTOBEORNOT"
  end
end
