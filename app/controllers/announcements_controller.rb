# frozen_string_literal: true

class AnnouncementsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_announcement, only: [:destroy, :update]

  def create
    @announcement = Announcement.new(announcement_params)
    @announcement.user = current_user

    authorize @announcement

    # bug: using format.html with render after saving will redirect to /announcements even if i have no redirects
    respond_to do |format|
      if @announcement.save
        format.turbo_stream {
          render(
            turbo_stream: [
              turbo_stream.replace(
                "new_announcement",
                partial: "/announcements/form",
                locals: {announcement: Announcement.new(guild: @announcement.guild)}
              ),
              turbo_stream.replace(
                dom_id(@announcement.guild, "announcements")[1..-1],
                partial: "/announcements/list",
                locals: {guild: @announcement.guild}
              )
            ]
          )
        }
        format.html { redirect_to guild_url(@announcement.guild), notice: "Announcement was successfully created." }
      else
        format.html { render "/announcements/_form", locals: {announcement: @announcement} }
      end
    end
  end

  def update
    authorize @announcement

    respond_to do |format|
      if @announcement.update(p)
        format.html { redirect_to guild_url(@announcement.guild), notice: "Announcement was successfully updated." }
      else
        format.html { render "form", locals: {announcement: @announcement} }
      end
    end
  end

  def destroy
    authorize @announcement

    @announcement.destroy
    respond_to do |format|
      format.turbo_stream { render turbo_stream: turbo_stream.remove(dom_id(@announcement)[1..-1]) }
      format.html { redirect_to guild_path(@announcement.guild), status: :see_other, notice: "Announcement was successfully destroyed." }
    end
  end

  private

  def set_announcement
    @announcement = Announcement.find(params[:id])
  end

  def announcement_params
    params.require(:announcement).permit(:message, :guild_id)
  end
end
