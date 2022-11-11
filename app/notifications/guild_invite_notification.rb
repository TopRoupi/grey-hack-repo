# To deliver this notification:
#
# GuildInviteNotification.with(post: @post).deliver_later(current_user)
# GuildInviteNotification.with(post: @post).deliver(current_user)

class GuildInviteNotification < Noticed::Base
  deliver_by :database
  # deliver_by :email, mailer: "UserMailer"

  param :user, :guild

  # Define helper methods to make rendering easier.
  #
  # def message
  #   t(".message")
  # end
  #
  # def url
  #   post_path(params[:post])
  # end
end
