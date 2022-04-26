# frozen_string_literal: true

class SitemapController < ApplicationController
  def index
    @pages = ["/", "/npc_decipher"]

    respond_to do |format|
      format.xml
    end
  end
end
