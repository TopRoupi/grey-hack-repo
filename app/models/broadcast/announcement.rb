module Broadcast
  class Announcement
    include Rails.application.routes.url_helpers
    include ActionView::RecordIdentifier
    include CableReady::Broadcaster
    attr_reader :guild, :guild_announcements_dom_id, :stream_id

    def self.prepend_announcement(announcement:)
      new(announcement).prepend_announcement
    end

    def initialize(announcement)
      @announcement = announcement
      @guild = announcement.guild
      @guild_announcements_dom_id = dom_id(@guild, "announcements")[1..-1]
      @stream_id = Cable.signed_stream_name(@guild_announcements_dom_id)
    end

    def prepend_announcement
      cable_ready[ApplicationChannel]
        .insert_adjacent_html(selector: "##{@guild_announcements_dom_id}", position: :afterbegin, html: rendered_announcement)
        .broadcast_to(@stream_id)
    end

    private

    def rendered_announcement
      ApplicationController.renderer.render(
        "/announcements/_announcement",
        locals: {announcement: @announcement},
        layout: false
      )
    end
  end
end
