# frozen_string_literal: true

class Users::PostsBox::CategoriesList::Component < ApplicationComponent
  def initialize(user:, categories:, active_tab: :all, render_all_tab: true, remove_top_margin: true, highlighted: nil)
    @categories = categories
    @user = user
    @active_tab = active_tab
    @render_all_tab = render_all_tab
    @remove_top_margin = remove_top_margin
    @highlighted = highlighted
  end
end
