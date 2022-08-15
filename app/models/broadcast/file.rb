module Broadcast
  class File
    include Rails.application.routes.url_helpers
    include ActionView::RecordIdentifier
    include CableReady::Broadcaster
    attr_reader :file, :build, :file_tree_dom_id, :stream_id

    def self.morph(file:)
      new(file).morph
    end

    def initialize(file)
      @file = file
      @build = @file.find_build
      @file_tree_dom_id = dom_id(build, "file_tree")
      @stream_id = Cable.signed_stream_name(file_tree_dom_id[1..-1])
    end

    def morph
      cable_ready[ApplicationChannel]
        .inner_html(selector: file_tree_dom_id, html: rendered_file_tree)
        .broadcast_to(stream_id)
    end

    private

    def rendered_file_tree
      ApplicationController.renderer.render(
        FileableForm::Tree.new(fileable: build),
        layout: false
      )
    end
  end
end
