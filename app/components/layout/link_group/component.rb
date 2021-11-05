# frozen_string_literal: true

class Layout::LinkGroup::Component < ApplicationComponent
  renders_many :links, ->(link: nil, name: nil, disabled: link.nil?, active: false, html_class: {}) do
    bg = html_class[:bg] || "bg-beaver-800 hover:bg-beaver-700"
    bg = html_class[:bg_disabled] || "bg-beaver-850" if disabled
    bg = html_class[:bg_active] || "bg-beaver-600" if active

    rounded = ""
    rounded += "rounded-#{@vertical ? "t" : "l"}-md" if links.length == 0
    rounded += "rounded-#{@vertical ? "b" : "r"}-md" if links.length == @links_count - 1

    border = " border-#{@vertical ? "b" : "r"} border-beaver-900" unless @links_count == 1 || links.length == @links_count - 1

    klass = [bg, rounded, border, html_class[:container] || "py-3 w-full text-center justify-center font-medium flex items-center"].join " "

    Layout::LinkGroup::Link::Component.new(link: active || disabled ? nil : link, name: name, class: klass)
  end

  def initialize(links_count, direction = :horizontal)
    @links_count = links_count
    @vertical = true if direction == :vertical
    @horizontal = true if direction == :horizontal
  end
end
