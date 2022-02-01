# frozen_string_literal: true


class Users::PostsBox::Component < ApplicationComponent
  def initialize(user:, posts:, pagy:, active_tab: :all)
    @user = user
    @posts = posts
    @pagy = pagy
    @active_tab = active_tab
    @categories = Category.all
    @visibilities_categories = []

    @visibilities_categories << OpenStruct.new({name: "Public", icon: "eye", id: "public"})
    @visibilities_categories << OpenStruct.new({name: "Not_listed", icon: "eye-closed", id: "not_listed"})
    @visibilities_categories << OpenStruct.new({name: "Private", icon: "lock", id: "private"})
  end
end
