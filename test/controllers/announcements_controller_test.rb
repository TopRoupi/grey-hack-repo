# frozen_string_literal: true

require "test_helper"

class AnnouncementsControllerTest < ActionDispatch::IntegrationTest
  class GuestUser < ActionDispatch::IntegrationTest
    setup do
      @announcement = build :announcement
    end

    test "guest user should not create announcement" do
      assert_difference("Announcement.count", 0) do
        post announcements_url, params: {announcement: {message: "sssssssS"}}
      end

      assert_response :redirect
    end

    test "guest user should not destroy announcement" do
      @announcement.save

      assert_difference("Announcement.count", 0) do
        delete announcement_url(@announcement)
      end

      assert_response :redirect
    end

    test "guest user should not edit announcement" do
      @announcement.save
      new_value = "DDDDDDDDDDDDDDDD"

      patch announcement_url(@announcement), params: {announcement: {message: new_value}}
      @announcement.reload

      refute_equal new_value, @announcement.message
    end
  end

  class LoggedUser < ActionDispatch::IntegrationTest
    setup do
      @guild = create :guild
      @user = @guild.admin
      @announcement = create :announcement, guild: @guild, user: @user
      sign_in @user
    end

    test "guild member should create announcement" do
      assert_difference("Announcement.count", 1) do
        post announcements_url, params: {announcement: {message: "ssssswwwwwwwssS", guild_id: @announcement.guild.id}}
      end
    end

    test "user that is not a member should not create announcement" do
      sign_in create(:user)
      assert_difference("Announcement.count", 0) do
        post announcements_url, params: {announcement: {message: "ssssswwwwwwwssS", guild_id: @announcement.guild.id}}
      end
    end

    test "guild member should delete his own announcement" do
      assert_difference("Announcement.count", -1) do
        delete announcement_url(@announcement)
      end
    end

    test "guild member should not delete his someone elses announcement" do
      new_announcement = create :announcement, guild: @guild
      assert_difference("Announcement.count", 0) do
        delete announcement_url(new_announcement)
      end
    end

    test "guild member should edit his own announcement" do
      new_value = "AAAAAAAAAA"

      patch announcement_url(@announcement), params: {announcement: {message: new_value}}

      @announcement.reload

      assert_equal new_value, @announcement.message
    end

    test "guild member should not edit someone elses announcement" do
      new_announcement = create :announcement, guild: @guild
      new_value = "AAAAAAAAAA"

      patch announcement_url(new_announcement), params: {announcement: {message: new_value}}

      @announcement.reload

      refute_equal new_value, new_announcement.message
    end
  end
end
