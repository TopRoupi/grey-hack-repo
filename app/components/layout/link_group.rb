# frozen_string_literal: true

class Layout::LinkGroup < ApplicationComponent
  renders_many :links, lambda { |link: nil, name: nil, active: false, disabled: link.nil?, **kwargs, &block|
    bg = @dark ? "bg-beaver-900 hover:bg-beaver-850 border border-beaver-800" : "bg-beaver-800 hover:bg-beaver-700"
    bg = @dark ? "bg-beaver-900 border border-beaver-800 text-beaver-300" : "bg-beaver-850" if disabled
    bg = @dark ? "bg-beaver-850 border border-beaver-800" : "bg-beaver-600" if active

    rounded = ""
    rounded += "rounded-#{@vertical ? "t" : "l"}-md" if links.length == 0
    rounded += "rounded-#{@vertical ? "b" : "r"}-md" if links.length == @links_count - 1

    border = " border-#{@vertical ? "b" : "r"} border-beaver-900" unless @dark || @links_count == 1 || links.length == @links_count - 1
    margin = @vetical ? "margin-bottom: 1px" : "margin-right: 1px" if @dark

    kwargs[:class] = [bg, rounded, border, "py-3 w-full text-center justify-center font-medium flex items-center"].join " "
    kwargs[:style] = margin
    kwargs[:href] = link

    content_tag(:a, **kwargs) { name || block.call }
  }

  def initialize(links_count, direction = :horizontal, dark: false)
    @links_count = links_count
    @vertical = true if direction == :vertical
    @horizontal = true if direction == :horizontal
    @dark = dark
  end
end
