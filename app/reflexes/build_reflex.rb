# frozen_string_literal: true

class BuildReflex < ApplicationReflex
  def clone_build
    build = Build.find_signed(element.dataset[:build_id])

    clone = build.amoeba_dup
    clone.published = false
    clone.save
  end
end
