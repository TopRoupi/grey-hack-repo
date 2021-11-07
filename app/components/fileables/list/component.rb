# frozen_string_literal: true

class Fileables::List::Component < ApplicationComponent
  def initialize(fileable:, depth: 0)
    @fileable = fileable
    @depth = depth
  end
end
