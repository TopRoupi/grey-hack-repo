# frozen_string_literal: true

class BuildSelector < ApplicationComponent
  def initialize(builds:, selected_build:)
    @builds = builds
    @selected_build = selected_build
  end
end
