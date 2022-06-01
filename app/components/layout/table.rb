# frozen_string_literal: true

class Layout::Table < ApplicationComponent
  renders_one :head, lambda { |**kwargs|
    kwargs[:head] = true

    Layout::TableRow.new(**kwargs)
  }

  renders_many :rows, lambda { |**kwargs|
    Layout::TableRow.new(**kwargs)
  }

  renders_one :foot, lambda { |**kwargs|
    kwargs[:foot] = true

    Layout::TableRow.new(**kwargs)
  }

  def initialize(tag: :table, **sys_params)
    @sys_params = sys_params
    @sys_params[:class] = "w-full rounded overflow-hidden table-auto #{@sys_params[:class]}"
    @tag = tag
  end
end
