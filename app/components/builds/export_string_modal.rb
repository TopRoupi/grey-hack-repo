# frozen_string_literal: true

class Builds::ExportStringModal < ApplicationComponent
  def initialize(build:, **button_options)
    @build = build
    @button_options = button_options
    @button_options[:tag] ||= :button
    @button_options[:class] ||= "btn btn-sm"
  end
end
