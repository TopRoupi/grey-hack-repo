# frozen_string_literal: true

class Layout::BaseComponent < ApplicationComponent
  def initialize(tag: "div", **sys_params)
    @tag = tag
    @sys_params = sys_params
  end

  def call
    content_tag(@tag, content, @sys_params)
  end
end
