# frozen_string_literal: true

class FileableForm::Reflex < ApplicationReflex
  def select
    build = Build.find(element.dataset[:build_id].to_i)

    morph("#fileable-tree", render(FileableForm::Tree.new(fileable: build)))
    morph("#build-form", render("builds/_form", locals: {build: build}))
  end
end
