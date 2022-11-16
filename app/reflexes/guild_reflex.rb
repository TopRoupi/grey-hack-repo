# frozen_string_literal: true

class GuildReflex < ApplicationReflex
  def kick_player
    user = User.find_signed(element.dataset[:user_id])
    guild = current_user.owner_guild

    GuildsUser.where(user: user, guild: guild).destroy_all
  end
end
