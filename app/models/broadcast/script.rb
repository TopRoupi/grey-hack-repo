module Broadcast
  class Script
    include Rails.application.routes.url_helpers
    include ActionView::RecordIdentifier
    include CableReady::Broadcaster
    attr_reader :script, :build, :file_tree_dom_id, :stream_id

    def self.morph(script:)
      new(script).morph
    end

    def initialize(script)
      @script = script
      @build = @script.find_build
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
      ActionController::Base.renderer.render(
        FileableForm::Tree.new(fileable: build),
        layout: false
      )
    end
  end
end
