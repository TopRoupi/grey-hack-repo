# frozen_string_literal: true

class Posts::BuildsCard::FileableList::Item::Component < ApplicationComponent
  def initialize(file:, depth: 0, edit: false, index: nil)
    @file = file
    @depth = depth
    @edit = edit
    @index = index
  end

  def type
    @file.class.to_s
  end
end
