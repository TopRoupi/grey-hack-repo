# frozen_string_literal: true

class FileableExplorerReflex < ApplicationReflex
  def open
    type = element.dataset[:fileable_type]
    id = element.dataset[:fileable_id].to_i
    fileable = type.constantize.find(id)
    morph("#fileable-explorer", render(FileableExplorer.new(fileable: fileable), layout: false))
  end
end
