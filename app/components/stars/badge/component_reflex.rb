# frozen_string_literal: true

class Stars::Badge::ComponentReflex < ApplicationReflex
  def star
    return send_alert("Not logged in", :error) if current_user.nil?

    starable_id = element.dataset["starable-id"]
    starable_type = element.dataset["starable_type"]

    starable = starable_type.constantize.find_signed starable_id

    star = current_user.stars.where(starable: starable)
    if star.blank?
      Star.create user: current_user, starable: starable
    else
      star.first.destroy
    end

    morph dom_id(starable, "star_badge"), render(Stars::Badge::Component.new(starable: starable.reload, user: current_user))
  end
end
