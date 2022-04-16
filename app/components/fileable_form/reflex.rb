# frozen_string_literal: true

class FileableForm::Reflex < ApplicationReflex
  def select
    build = Build.find(element.dataset[:build_id].to_i)

    morph("#fileable-tree", render(FileableForm::Tree.new(fileable: build)))
  end
end
