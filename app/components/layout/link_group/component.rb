class Layout::LinkGroup::Component < ApplicationComponent
  renders_many :links, ->(link: nil, name: nil, disabled: link.nil?, active: false) do
    bg = "bg-beaver-800 hover:bg-beaver-700"
    bg = "bg-beaver-850" if disabled
    bg = "bg-beaver-600" if active

    rounded = ""
    rounded += "rounded-l-md" if links.length == 0
    rounded += "rounded-r-md" if links.length == @links_count - 1

    border = " border-r border-beaver-900" unless @links_count == 1 || links.length == @links_count - 1

    klass = [bg, rounded, border, "py-3 w-full text-center justify-center font-medium flex items-center"].join " "

    Layout::LinkGroup::Link::Component.new(link: active || disabled ? nil : link, name: name, class: klass)
  end

  def initialize(links_count)
    @links_count = links_count
  end
end
