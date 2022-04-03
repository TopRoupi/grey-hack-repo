# frozen_string_literal: true

class Layout::LinkGroup::Link < ApplicationComponent
  def initialize(options)
    @reflex = options[:reflex]
    @class = options[:class]
    @link = options[:link]
    @name = options[:name]
  end
end
