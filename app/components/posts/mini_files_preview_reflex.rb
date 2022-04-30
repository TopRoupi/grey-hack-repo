# frozen_string_literal: true

class Posts::MiniFilesPreviewReflex < ApplicationReflex
  def open
    folder = Folder.find_signed(element.dataset[:folder_id])

    cable_ready
      .replace(selector: "##{folder.foldable.signed_id}_mini_files_preview", html: render(Posts::MiniFilesPreview.new(fileable: folder), layout: false))
    morph :nothing
  end

  def back
    folder = Folder.find_signed(element.dataset[:folder_id])

    cable_ready
      .replace(selector: "##{folder.signed_id}_mini_files_preview", html: render(Posts::MiniFilesPreview.new(fileable: folder.foldable), layout: false))
    morph :nothing
  end
end
