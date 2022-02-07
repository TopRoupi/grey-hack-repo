# frozen_string_literal: true

class Comment < ApplicationRecord
  belongs_to :user
  belongs_to :commentable, polymorphic: true

  validates :content, length: {maximum: 255}, presence: true

  after_create_commit :notify_user

  private

  def notify_user
    CommentNotification.with(comment: self).deliver_later(commentable.user)
  end
end
