class Invites::Create < ApplicationTransaction
  include Dry::Transaction

  step :find_user
  step :check_user_guild
  step :check_if_invite_is_a_duplicate
  step :persist

  def find_user(name:, guild:)
    @user = User.find_by(name: name)
    @guild = guild

    if @user
      Success()
    else
      Failure("Could not find user: #{name}")
    end
  end

  def check_user_guild
    if @user.guild
      Failure("User is in a guild already")
    else
      Success()
    end
  end

  def check_if_invite_is_a_duplicate
    if Invite.where("accepted_date IS NULL", user: @user, guild: @guild).any?
      Failure("You already sent a invite to #{@user.name}")
    else
      Success()
    end
  end

  def persist
    invite = Invite.new guild: @guild, user: @user
    invite.set_random_key

    if invite.save
      Success("Invite sent to: #{@user.name}")
    else
      Failure("Sorry a error occurred")
    end
  end
end
