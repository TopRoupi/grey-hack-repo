# frozen_string_literal: true

# To deliver this notification:
#
# CommentNotification.with(post: @post).deliver_later(current_user)
# CommentNotification.with(post: @post).deliver(current_user)

class CommentNotification < Noticed::Base
  deliver_by :database

  param :comment

  def message
    comment = params[:comment]
    if comment.commentable.instance_of? Post
      "#{comment.user.name} posted a new comment on #{comment.commentable.title}"
    end
  end
end
