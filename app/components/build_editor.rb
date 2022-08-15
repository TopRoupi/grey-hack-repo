# frozen_string_literal: true

class BuildEditor < ApplicationComponent
  attr_accessor :build, :file

  def initialize(build:, file: nil)
    @build = build
    @file = file
  end

  def file_destroy_button
    options = {}

    reflex = "destroy_#{file.class.to_s.downcase}"

    options[:class] = "btn btn-error float-left"
    options[:data] = {}
    options[:data][:reflex] = "click->FileableForm::Reflex##{reflex}"

    if @file.instance_of?(Script)
      options[:data][:script_id] = file.signed_id
    else
      options[:data][:folder_id] = file.signed_id
    end

    render(Layout::ConfirmationDialog.new) do |c|
      c.title { "Delete #{file.name}" }
      c.button(class: "btn btn-error float left") { "Delete #{file.class}" }
      c.action(tag: :button, style: "error", data: options[:data]) { "Delete" }
    end
  end
end
