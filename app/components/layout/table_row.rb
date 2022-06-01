# frozen_string_literal: true

class Layout::TableRow < ApplicationComponent
  renders_many :columns, lambda { |**kwargs|
    kwargs[:tag] = @head ? :th : :td
    kwargs[:class] = "p-2 #{kwargs[:class]}"
    Layout::BaseComponent.new(**kwargs)
  }

  def initialize(tag: :tr, head: false, foot: false, **sys_params)
    @sys_params = sys_params
    @tag = tag
    @head = head
    @foot = foot

    @sys_params[:class] ||= ""
    @sys_params[:class] += " bg-beaver-850" if @head == false && @foot == false
  end
end
