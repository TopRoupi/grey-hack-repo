# frozen_string_literal: true

class Layout::LinkGroup < ApplicationComponent
  renders_many :links, lambda { |link: nil, name: nil, active: false, disabled: link.nil?, custom: {}, **kwargs, &block|
    if custom.blank?
      classes = "shrink btn btn-block btn-neutral "
      classes += "btn-disabled" if disabled
      classes += "btn-active" if active
    else
      classes = custom[:class]
      classes += custom[:disabled] if disabled && custom[:disabled]
      classes += custom[:active] if active && custom[:active]
    end

    kwargs[:class] = classes
    kwargs[:href] = link

    content_tag(:a, **kwargs) { name || block.call }
  }

  def initialize(gap: 1)
    @gap = gap
  end
end
