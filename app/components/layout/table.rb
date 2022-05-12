# frozen_string_literal: true

class Layout::Table < ApplicationComponent
  renders_many :rows, lambda { |**kwargs|
    kwargs[:head] = true if rows.length == 0

    Layout::TableRow.new(**kwargs)
  }

  def initialize(tag: :table, **sys_params)
    @sys_params = sys_params
    @sys_params[:class] = "w-full rounded overflow-hidden table-auto #{@sys_params[:class]}"
    @tag = tag
  end
end
