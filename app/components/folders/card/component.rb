# frozen_string_literal: true

class Folders::Card::Component < ApplicationComponent
  def initialize(folder:)
    @folder = folder
  end
end
