class InvitesController < ApplicationController
  before_action :set_invite, only: %i[accept destroy]

  def create
    guild = Guild.where(user_id: current_user).first
    invite = Invite.new guild: guild

    authorize invite

    user_name = params[:invite][:name]
    user = User.where(name: user_name).first

    if user == current_user
      redirect_back fallback_location: :root, alert: "You cant invite your self"
      return
    end

    if user
      if Invite.where(user: user, guild: guild).any?
        redirect_back fallback_location: :root, alert: "You already sent a invite to #{user_name}"
        return
      end

      invite.user = user
      invite.set_random_key

      if invite.save
        redirect_back fallback_location: :root, notice: "Invite sent to: #{user_name}"
      else
        redirect_back fallback_location: :root, alert: "Sorry a error occurred"
      end
    else
      redirect_back fallback_location: :root, alert: "Could not find user: #{user_name}"
    end
  end

  def accept
    if @invite.update(accepted_date: Time.now)
      redirect_back fallback_location: :root, notice: "Invite accepted"
      Invite.where("user_id = #{current_user.id} AND id != #{@invite.id}").destroy_all
    else
      redirect_back fallback_location: :root, alert: "Something went wrong"
    end
  end

  def destroy
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
