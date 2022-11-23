# frozen_string_literal: true

class GuildReflex < ApplicationReflex
  def kick_player
    user = User.find_signed(element.dataset[:user_id])
    guild = current_user.owner_guild

    GuildsUser.where(user: user, guild: guild).destroy_all
  end

  def cancel_invite
    invite = Invite.find_signed(element.dataset[:invite_id])

    return if current_user != invite.guild.user

    invite.destroy
  end
end
