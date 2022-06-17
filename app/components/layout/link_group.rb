# frozen_string_literal: true

class Layout::LinkGroup < ApplicationComponent
  renders_many :links, lambda { |link: nil, name: nil, active: false, disabled: link.nil?, **kwargs, &block|
    classes = "shrink btn btn-block btn-neutral "
    classes += "btn-disabled" if disabled
    classes += "btn-active" if active

    kwargs[:class] = classes
    kwargs[:href] = link

    content_tag(:a, **kwargs) { name || block.call }
  }
end
