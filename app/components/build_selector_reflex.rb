# frozen_string_literal: true

class BuildSelectorReflex < ApplicationReflex
  def open
    build = Build.find(element.dataset[:build_id].to_i)
    post = build.post
    cable_ready.replace(selector: "#build-explorer", html: render(BuildExplorer.new(post: post, selected_build: build), layout: false))
    morph :nothing
  end
end
