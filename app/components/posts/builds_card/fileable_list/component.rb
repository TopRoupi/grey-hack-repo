# frozen_string_literal: true

class Posts::BuildsCard::FileableList::Component < ApplicationComponent
  def initialize(fileable:, depth: 0, edit: false, index_table: nil)
    @fileable = fileable
    @depth = depth
    @edit = edit
    @index_table = index_table || @fileable.children_index_table
    @fileable_index = @index_table.key(@fileable)
  end
end
