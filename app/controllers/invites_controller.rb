class InvitesController < ApplicationController
  before_action :set_invite, only: %i[accept destroy]

  def create
    guild = Guild.find_by(user_id: current_user)
    invite = Invite.new guild: guild

    authorize invite

    invite_name = params[:invite][:name]
    user = User.find_by(name: invite_name)

    if user.nil?
      redirect_back fallback_location: :root, alert: "Could not find user: #{invite_name}"
      return
    end

    if !user.guild.nil?
      redirect_back fallback_location: :root, alert: "User is in a guild already"
      return
    end

    if Invite.where("accepted_date IS NULL", user: user, guild: guild).any?
      redirect_back fallback_location: :root, alert: "You already sent a invite to #{invite_name}"
      return
    end

    invite.user = user
    invite.set_random_key

    if invite.save
      redirect_back fallback_location: :root, notice: "Invite sent to: #{invite_name}"
    else
      redirect_back fallback_location: :root, alert: "Sorry a error occurred"
    end
  end

  def accept
    authorize @invite

    if @invite.update(accepted_date: Time.now)
      Invite.where("user_id = #{current_user.id} AND id != #{@invite.id} AND accepted_date IS NULL").destroy_all
      GuildsUser.create(user: @invite.user, guild: @invite.guild)
      redirect_back fallback_location: :root, notice: "Invite accepted"
    else
      redirect_back fallback_location: :root, alert: "Something went wrong"
    end
  end

  def destroy
    authorize @invite

    if @invite.destroy
      redirect_back fallback_location: :root, notice: "Invite rejected"
    else
      redirect_back fallback_location: :root, alert: "Something went wrong"
    end
  end

  private

  def set_invite
    @invite = Invite.where(key: params[:id]).first
  end

  def invite_params
    params.require(:invite).permit(
      :name
    )
  end
end
