class Layout::LinkGroup::Link::Component < ApplicationComponent
  def initialize(options)
    @reflex = options[:reflex]
    @class = options[:class]
    @link = options[:link]
    @name = options[:name]
  end
end
