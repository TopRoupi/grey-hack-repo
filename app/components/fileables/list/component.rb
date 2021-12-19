# frozen_string_literal: true

class Fileables::List::Component < ApplicationComponent
  def initialize(fileable:, depth: 0, edit: false)
    @fileable = fileable
    @depth = depth
    @edit = edit
  end
end
