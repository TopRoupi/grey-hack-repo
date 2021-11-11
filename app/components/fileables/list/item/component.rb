# frozen_string_literal: true

class Fileables::List::Item::Component < ApplicationComponent
  def initialize(file:, depth: 0)
    @file = file
    @depth = depth
  end

  def type
    @file.class.to_s
  end
end
