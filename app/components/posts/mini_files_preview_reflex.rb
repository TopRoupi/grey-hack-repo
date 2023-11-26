# frozen_string_literal: true

class Posts::MiniFilesPreviewReflex < ApplicationReflex
  def open
    folder = Folder.find_signed(element.dataset[:folder_id])

    cable_ready
      .morph(selector: dom_id(folder.foldable, "mini_files_preview"), html: render(Posts::MiniFilesPreview.new(fileable: folder), layout: false))
    morph :nothing
  end

  def back
    folder = Folder.find_signed(element.dataset[:folder_id])

    cable_ready
      .morph(selector: dom_id(folder, "mini_files_preview"), html: render(Posts::MiniFilesPreview.new(fileable: folder.foldable), layout: false))
    morph :nothing
  end
end
