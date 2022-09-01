class GistsController < ApplicationController
  before_action :set_gist, only: %i[show edit update destroy]
  before_action :authenticate_user!, only: [:edit, :update, :destroy]
  before_action :authorize_user!, only: [:edit, :update, :destroy]

  # GET /gists or /gists.json
  def index
    @gists = Gist.order(created_at: :desc)
    @pagy, @gists = pagy @gists
  end

  # GET /gists/1 or /gists/1.json
  def show
  end

  # GET /gists/new
  def new
    @gist = Gist.new
    @gist.scripts << Script.new(name: "script.md", content: "# my documentation\nif it compiles it works :)")
    @gist.scripts << Script.new(name: "script.src", content: "if true == true then\n\tprint(\"hello\")\nend if")
  end

  # GET /gists/1/edit
  def edit
  end

  # POST /gists or /gists.json
  def create
    @gist = Gist.new(gist_params)
    @gist.user = current_user

    respond_to do |format|
      if @gist.save
        format.html { redirect_to gist_url(@gist), notice: "Gist was successfully created." }
        format.json { render :show, status: :created, location: @gist }
      else
        puts @gist.errors.to_a
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @gist.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /gists/1 or /gists/1.json
  def update
    respond_to do |format|
      if @gist.update(gist_params)
        format.html { redirect_to gist_url(@gist), notice: "Gist was successfully updated." }
        format.json { render :show, status: :ok, location: @gist }
      else
        format.html { render :edit, status: :unprocessable_entity }
        format.json { render json: @gist.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /gists/1 or /gists/1.json
  def destroy
    @gist.destroy

    respond_to do |format|
      format.html { redirect_to gists_url, notice: "Gist was successfully destroyed." }
      format.json { head :no_content }
    end
  end

  private

  def authorize_user!
    redirect_to :root, alert: "action not permitted" if @gist.user != current_user
  end

  # Use callbacks to share common setup or constraints between actions.
  def set_gist
    @gist = Gist.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def gist_params
    params.require(:gist).permit(
      :name,
      :description,
      :anonymous,
      scripts_attributes: [:id, :name, :content, :_destroy]
    )
  end
end
