# frozen_string_literal: true

class ImgReflex < ApplicationReflex
  def convert
    data = params[:gen][:data]
    width = data.split("\n")[0].split(" ").size / 3
    # p width
    data = data.split(" ")
    data.map!(&:to_i)

    pixels = data.each_slice(3).to_a
    pixels.map! { |i| rgb(i) }
    pixels = pixels.unshift "#{width} "
    # p pixels

    cable_ready
      .text_content(selector: "#gen_output", text: pixels.join(""))
      .broadcast

    morph :nothing
  end

  private

  def rgb(v)
    r, g, b = v
    "#{to_hex r}#{to_hex g}#{to_hex b}"
  end

  def to_hex(n)
    n.to_s(16).rjust(2, "0").upcase
  end
end
