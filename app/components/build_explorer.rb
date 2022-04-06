# frozen_string_literal: true

class BuildExplorer < ApplicationComponent
  def initialize(builds:)
    @builds = builds
  end
end
