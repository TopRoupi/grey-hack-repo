class Pagy::Link::Component < ApplicationComponent
  def initialize(options)
    @reflex = options[:reflex]
    @class = options[:class]
    @page = options[:page]
  end
end
