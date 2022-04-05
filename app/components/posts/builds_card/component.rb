# frozen_string_literal: true

class Posts::BuildsCard::Component < ApplicationComponent
  def initialize(builds:, edit: false)
    @edit = edit
    @builds = builds
  end

  def before_render
    @selected_index = session[:selected_build]
    @selected_build = @builds[@selected_index] if @selected_index

    return if @selected_build.nil? || @edit

    @export_string = @selected_build.export_string
  end
end
