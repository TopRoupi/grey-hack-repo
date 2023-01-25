class GuildsController < ApplicationController
  before_action :set_guild, only: %i[manager create_invite show edit update destroy]

  def index
    authorize Guild

    @guilds = Guild.all
  end

  def show
    authorize @guild

    @announcement = Announcement.new(guild: @guild)
  end

  def manager
    authorize @guild

    @open_invites = Invite.where("accepted_date IS NULL", guild: @guild)
  end

  def new
    authorize Guild

    @guild = Guild.new
  end

  def create
    authorize Guild

    @guild = Guild.new(guild_params)
    @guild.user = current_user

    respond_to do |format|
      if @guild.save
        format.html { redirect_to guild_path(@guild), notice: "Guild was successfully created." }
        format.json { render :show, status: :created, location: @guild }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @guild.errors, status: :unprocessable_entity }
      end
    end
  end

  def edit
    authorize @guild
  end

  def update
    authorize @guild

    respond_to do |format|
      # TODO better way to filter params
      p = guild_params
      p.delete :name
      if @guild.update(p)
        format.html { redirect_to guild_url(@guild), notice: "Guild was successfully updated." }
        format.json { render :show, status: :ok, location: @gist }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @guild.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    authorize @guild

    @guild.destroy
    respond_to do |format|
      format.html { redirect_to :root, notice: "Guild was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def set_guild
    @guild = Guild.friendly.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def guild_params
    params.require(:guild).permit(
      :name,
      :description,
      :banner,
      :avatar,
      :badge,
      :alignment,
      :registration_info,
      :tag
    )
  end
end
