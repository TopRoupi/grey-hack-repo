# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :commentable, polymorphic: true

  validates :content, length: {maximum: 255}, presence: true

  after_create_commit :notify_user
  after_destroy_commit :remove_notification

  private

  def notify_user
    return if commentable.user == user
    CommentNotification.with(comment: self).deliver(commentable.user)
  end

  def remove_notification
    Notification.where(params: {comment: self}).destroy_all
  end
end
