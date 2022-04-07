# frozen_string_literal: true

class FileableExplorer < ApplicationComponent
  def initialize(fileable:)
    @fileable = fileable
  end

  def files
    @fileable.folders.order(name: :asc).to_a + @fileable.scripts.order(name: :asc).to_a
  end

  def root?
    @fileable.fileable.instance_of?(Build)
  end

  def render_back_button?
    @fileable.respond_to? :foldable
  end

  def back_button_attributes
    {
      class: "button_secondary rounded py-1 px-1 mr-2 flex items-center w-fit",
      data: {
        reflex: "click->FileableExplorerReflex#open",
        fileable_id: @fileable.foldable_id,
        fileable_type: @fileable.foldable_type
      }
    }
  end
end
