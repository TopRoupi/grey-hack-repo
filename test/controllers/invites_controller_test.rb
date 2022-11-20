require "test_helper"

class InvitesControllerTest < ActionDispatch::IntegrationTest
  class GuestUser < ActionDispatch::IntegrationTest
    setup do
      @invite = create :invite
    end

    test "should not create invite" do
      user = create :user
      assert_difference("Invite.count", 0) do
        post invites_url, params: {invite: {name: user.name}}
      end

      assert_response :redirect
      assert_redirected_to :root
    end

    test "should not accept invites" do
      patch invite_accept_url(@invite.key)
      @invite.reload

      assert_nil @invite.accepted_date

      assert_response :redirect
      assert_redirected_to :root
    end

    test "should not reject invites" do
      assert_difference("Invite.count", 0) do
        delete invite_url(@invite.key)
      end

      assert_response :redirect
      assert_redirected_to :root
    end
  end

  class LoggedUser < ActionDispatch::IntegrationTest
    setup do
      @user = create :user
      @guild = create :guild, user: @user
      sign_in @user
    end

    # create invites

    test "should create invite" do
      user = create :user
      assert_difference("@user.owner_guild.invites.count", 1) do
        post invites_url, params: {invite: {name: user.name}}
      end

      assert_response :redirect
    end

    test "should not create invite if user name doest exist" do
      assert_difference("Invite.count", 0) do
        post invites_url, params: {invite: {name: "dwadfej"}}
      end

      assert_response :redirect
    end

    test "should not create invite if the user doest own a guild" do
      @user.owner_guild.destroy!
      user = create :user
      assert_difference("Invite.count", 0) do
        post invites_url, params: {invite: {name: user.name}}
      end

      assert_response :redirect
    end

    test "should not create invite if the target user is in a guild already" do
      user = create :user
      guild = build :guild
      guild.members << user
      guild.save
      assert_difference("Invite.count", 0) do
        post invites_url, params: {invite: {name: user.name}}
      end

      assert_response :redirect
    end

    test "should not create invite if the target user owns a guild already" do
      user = create :user
      create :guild, user: user
      assert_difference("Invite.count", 0) do
        post invites_url, params: {invite: {name: user.name}}
      end

      assert_response :redirect
    end

    test "should not create a duplicate invite" do
      user = create :user
      create :invite, user: user, guild: @guild
      assert_difference("Invite.count", 0) do
        post invites_url, params: {invite: {name: user.name}}
      end

      assert_response :redirect
    end

    test "should create a invite even if the target user has accepted a invite for the same guild before" do
      user = create :user
      create :invite, guild: @guild, user: user, accepted_date: Time.now

      assert_difference("Invite.count", 1) do
        post invites_url, params: {invite: {name: user.name}}
      end

      assert_response :redirect
    end

    # accept invites

    test "should become a member of the guild after accepting a invite" do
      @user.guild.destroy
      guild = create :guild
      invite = create :invite, user: @user, guild: guild

      patch invite_accept_url(invite.key)

      @user.reload
      invite.reload
      refute_nil invite.accepted_date
      assert_equal @user.guild.id, guild.id
      assert_response :redirect
    end

    test "should destroy all the other pending invites after accepting a invite" do
      @user.guild.destroy
      guild = create :guild
      invite = create :invite, user: @user, guild: guild

      pending_invite = create(:invite, user: @user, guild: create(:guild))

      patch invite_accept_url(invite.key)

      assert_nil Invite.find_by(id: pending_invite.id)
      assert_response :redirect
    end

    test "should not destroy old accepted invites after accepting a invite" do
      @user.guild.destroy
      guild = create :guild
      invite = create :invite, user: @user, guild: guild
      old_accepted_invite = create :invite, user: @user, guild: guild, accepted_date: Time.now

      patch invite_accept_url(invite.key)

      refute_nil Invite.find_by(id: old_accepted_invite.id)
      assert_response :redirect
    end

    test "should not be able to accept invites of other users" do
      user = create :user
      guild = create :guild
      invite = create :invite, user: user, guild: guild

      patch invite_accept_url(invite.key)

      invite.reload

      assert_nil invite.accepted_date
      assert_nil user.guild
      assert_response :redirect
    end

    # reject invites

    test "should be able reject a invite" do
      @user.guild.destroy
      guild = create :guild
      invite = create :invite, user: @user, guild: guild

      delete invite_url(invite.key)

      assert_nil Invite.find_by(id: invite.id)
      assert_response :redirect
    end

    test "should not reject a invite of other users" do
      @user.guild.destroy
      user = create :user
      guild = create :guild
      invite = create :invite, user: user, guild: guild

      delete invite_url(invite.key)

      refute_nil Invite.find_by(id: invite.id)
      assert_response :redirect
    end
  end
end
