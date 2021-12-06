# frozen_string_literal: true

class Fileables::List::Item::Component < ApplicationComponent
  def initialize(file:, depth: 0, edit: false)
    @file = file
    @depth = depth
    @edit = edit
  end

  def type
    @file.class.to_s
  end
end