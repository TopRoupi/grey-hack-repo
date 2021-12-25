# frozen_string_literal: true

class Folders::Card::Component < ApplicationComponent
  def initialize(folder:, edit: false, index: nil)
    @folder = folder
    @edit = edit
    @index = index
  end
end
