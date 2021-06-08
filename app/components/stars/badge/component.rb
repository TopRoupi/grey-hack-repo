class Stars::Badge::Component < ApplicationComponent
  def initialize(starable:)
    @starable = starable
    @stars = @starable.stars
  end

  def stared?
    if current_user
      current_user.stars.where(starable: @starable).count == 1
    else
      false
    end
  end
end
