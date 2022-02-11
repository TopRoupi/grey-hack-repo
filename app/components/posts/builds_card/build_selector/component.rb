# frozen_string_literal: true

class Posts::BuildsCard::BuildSelector::Component < ApplicationComponent
  def initialize(builds:, edit: false, selected: nil)
    @builds = builds
    @edit = edit
    @selected = selected
  end
end
