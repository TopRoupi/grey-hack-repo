class Categories::Card::Component < ApplicationComponent
  def initialize(category:, link: true)
    @category = category
    @link = link
  end
end
