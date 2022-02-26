# frozen_string_literal: true

class Posts::BuildsCard::BuildSelector::Component < ApplicationComponent
  def initialize(builds:, edit: false, selected_build: nil)
    @builds = builds
    @edit = edit
    @selected_build = selected_build
  end

  def button_classes(build)
    classes = "mr-2 bg-beaver-800 hover:bg-beaver-700 cursor-pointer p-2 rounded select-none "
    classes += "!bg-beaver-700 " if build == @selected_build
    classes += "!cursor-auto " if build == @selected_build && !@edit
    classes += "hover:!bg-beaver-600" if build == @selected_build && @edit
    classes
  end

  def button_data_attributes(build, index)
    attributes = {}
    if !@edit && build != @selected_build
      attributes[:reflex] = "click->Posts::BuildsCard::BuildSelector::ComponentReflex#select"
      attributes[:index] = index.to_s
    end
    attributes
  end

  def reflex_attributes(action, index: nil)
    actions_attributes = {
      remove: {reflex: "click->Posts::BuildsCard::FileableList::ComponentReflex#remove_build", index: index},
      select: {reflex: "click->Posts::BuildsCard::BuildSelector::ComponentReflex#select", index: index},
      edit: {reflex: "click->Posts::BuildsCard::FileableList::ComponentReflex#edit_build", index: index},
      add: {reflex: "click->Posts::BuildsCard::FileableList::ComponentReflex#add_build"}
    }
    actions_attributes[action]
  end
end
