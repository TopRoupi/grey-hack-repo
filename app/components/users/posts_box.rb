# frozen_string_literal: true

class Users::PostsBox < ApplicationComponent
  def initialize(user:, current_user:, posts:, pagy:, active_tab: :all)
    @user = user
    @posts = posts
    @pagy = pagy
    @current_user = current_user
    @active_tab = active_tab
    @categories = Category.all
    @visibility_categories = []

    # hack to convert a visibility scope into a category
    @visibility_categories << OpenStruct.new({name: "Public", icon: "eye", id: "public"})
    @visibility_categories << OpenStruct.new({name: "Not_listed", icon: "eye-closed", id: "not_listed"})
    @visibility_categories << OpenStruct.new({name: "Private", icon: "lock", id: "private"})
  end
end
