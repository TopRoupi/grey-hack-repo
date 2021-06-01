class Users::PostsBox::CategoriesList::Component < ApplicationComponent
  def initialize(user:, categories:, active_tab: :all)
    @categories = categories
    @user = user
    @active_tab = active_tab
  end
end
