require "test_helper"

class GuildsControllerTest < ActionDispatch::IntegrationTest
  class GuestUser < ActionDispatch::IntegrationTest
    setup do
      @guild = create :guild
    end

    test "guest user should get index" do
      get guilds_url
      assert_response :success
    end

    test "guest user should get show" do
      get guild_url(@guild)
      assert_response :success
    end

    test "guest should not get new" do
      get new_guild_url
      assert_response :redirect
    end

    test "guest should not get edit" do
      get edit_guild_url(@guild)
      assert_response :redirect
    end

    test "guest should not get manager" do
      get guild_manager_url(@guild)
      assert_response :redirect
    end

    test "guest should not create guild" do
      assert_difference("Guild.count", 0) do
        post guilds_url, params: {guild: {name: @guild.name, alignment: @guild.alignment, description: @guild.description, tag: @guild.tag}}
      end

      assert_response :redirect
    end

    test "guest should not update guild" do
      new_tag = "LAW"
      patch guild_url(@guild), params: {guild: {tag: new_tag}}
      @guild.reload
      refute_equal @guild.tag, new_tag

      assert_response :redirect
    end

    test "guest should not destroy guild" do
      assert_difference("Guild.count", 0) do
        delete guild_url(@guild)
      end

      assert_response :redirect
    end
  end

  class LoggedUser < ActionDispatch::IntegrationTest
    setup do
      @guild = create :guild
      sign_in @guild.user
    end

    test "logged user should get index" do
      get guilds_url
      assert_response :success
    end

    test "logged should get show" do
      get guild_url(@guild)
      assert_response :success
    end

    test "logged should get new" do
      @guild.destroy!
      get new_guild_url
      assert_response :success
    end

    test "logged should not get new if he is already in a guild" do
      get new_guild_url
      assert_response :redirect
    end

    test "logged should get edit admin of the guild" do
      get edit_guild_url(@guild)
      assert_response :success
    end

    test "logged should not get edit he is not admin of the guild" do
      other_guild = create :guild
      get edit_guild_url(other_guild)
      assert_response :redirect
    end

    test "logged should get manager admin of the guild" do
      get guild_manager_url(@guild)
      assert_response :success
    end

    test "logged should not get manager if not admin of the guild" do
      other_guild = create :guild
      get guild_manager_url(other_guild)
      assert_response :redirect
    end

    test "logged user should create guild if he does not have guild" do
      @guild.destroy!

      assert_difference("Guild.count", 1) do
        post guilds_url, params: {guild: {name: @guild.name, alignment: @guild.alignment, description: @guild.description, tag: @guild.tag}}
      end

      assert_response :redirect
    end

    test "logged user should not create guild if he does have guild" do
      new_guild = build :guild
      assert_difference("Guild.count", 0) do
        post guilds_url, params: {guild: {name: new_guild.name, alignment: @guild.alignment, description: new_guild.description, tag: new_guild.tag}}
      end

      assert_response :redirect
    end

    test "logged user should update guild if admin" do
      new_tag = "EDE"
      patch guild_url(@guild), params: {guild: {tag: new_tag}}
      @guild.reload
      assert_equal @guild.tag, new_tag
      assert_redirected_to guild_url(@guild)
    end

    test "logged user should not update guild if not admin" do
      other_guild = create :guild
      new_tag = "EDE"
      patch guild_url(other_guild), params: {guild: {tag: new_tag}}
      other_guild.reload
      refute_equal other_guild.tag, new_tag
      assert_redirected_to :root
    end

    test "logged user should not update guild name even if admin" do
      new_name = "dawdawdwdw"
      patch guild_url(@guild), params: {guild: {tag: new_name}}
      @guild.reload
      refute_equal @guild.name, new_name
      assert_response 422
    end

    test "logged user should delete guild if admin" do
      assert_difference("Guild.count", -1) do
        delete guild_url(@guild)
      end

      assert_response :redirect
    end

    test "logged user should not delete guild if not admin" do
      other_guild = create :guild
      assert_difference("Guild.count", 0) do
        delete guild_url(other_guild)
      end

      assert_response :redirect
    end
  end
end
