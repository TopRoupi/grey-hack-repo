class GuildsController < ApplicationController
  before_action :set_guild, only: %i[show edit update destroy]

  def show
    authorize @guild
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
  end

  def update
  end

  def destroy
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
      :registration_info
    )
  end
end

