class InvitesController < ApplicationController
  before_action :set_invite, only: %i[accept destroy]

  def create
    guild = Guild.find_by(user_id: current_user)
    invite = Invite.new guild: guild

    authorize invite

    Invites::Create.call(name: params[:invite][:name], guild: guild) do |m|
      m.success do |success|
        redirect_back fallback_location: :root, notice: success
      end

      m.failure do |failure|
        redirect_back fallback_location: :root, alert: failure
      end
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
