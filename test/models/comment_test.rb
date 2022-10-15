# frozen_string_literal: true

# == Schema Information
#
# Table name: comments
#
#  id               :bigint           not null, primary key
#  commentable_type :string           not null
#  content          :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  commentable_id   :bigint           not null
#  user_id          :bigint           not null
#
# Indexes
#
#  index_comments_on_commentable  (commentable_type,commentable_id)
#  index_comments_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class CommentTest < ActiveSupport::TestCase
  setup do
    @comment = build :comment
  end

  test "creating a comment will create a new notification" do
    @comment.save
    refute_empty Notification.where(params: {comment: @comment})
  end

  test "deleting a comment will delete its notifications" do
    @comment.save
    refute_empty Notification.where(params: {comment: @comment})
    @comment.destroy
    assert_empty Notification.where(params: {comment: @comment})
  end

  test "if the comment user is equal to the commentable user it should not create a notification" do
    @comment.user = @comment.commentable.user
    @comment.save
    assert_empty Notification.where(params: {comment: @comment})
  end
end
