# frozen_string_literal: true

# == Schema Information
#
# Table name: comments
#
#  id               :bigint           not null, primary key
#  user_id          :bigint           not null
#  commentable_type :string           not null
#  commentable_id   :bigint           not null
#  content          :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
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
