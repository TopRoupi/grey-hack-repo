# frozen_string_literal: true

class Users::ProfilePreview < ApplicationComponent
  def initialize(banner:, avatar:, badge:, banner_html: {}, avatar_html: {}, badge_html: {})
    badge_html[:class] = "h-8 w-8 rounded-xl bg-base-200 border border-4 border-base-100 object-cover absolute bottom-6 right-0"
    badge_html[:src] = badge
    badge_html[:alt] = "user badge"
    @badge_html = badge_html

    banner_html[:class] = "rounded-t h-40 w-full object-cover absolute"
    banner_html[:src] = banner
    banner_html[:alt] = "user banner"
    @banner_html = banner_html

    avatar_html[:class] = "h-24 w-24 rounded-xl bg-base-200 -mt-6 mb-3 border border-4 border-base-100 object-cover absolute"
    avatar_html[:src] = avatar
    avatar_html[:alt] = "user avatar"
    @avatar_html = avatar_html
  end
end
