# frozen_string_literal: true

class Layout::TableRow < ApplicationComponent
  renders_many :columns, lambda { |**kwargs|
    kwargs[:tag] = @head ? :th : :td
    kwargs[:class] = "p-2"
    Layout::BaseComponent.new(**kwargs)
  }

  def initialize(tag: :tr, head: false, **sys_params)
    @sys_params = sys_params
    @tag = tag
    @head = head

    @sys_params[:class] = "bg-beaver-850" if @head == false
  end
end
