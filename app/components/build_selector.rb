# frozen_string_literal: true

class BuildSelector < ApplicationComponent
  def initialize(builds:)
    @builds = builds
  end
end
