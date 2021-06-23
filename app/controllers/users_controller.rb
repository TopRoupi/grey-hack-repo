# frozen_string_literal: true

class UsersController < ApplicationController
  def show
    @user = User.friendly.find(params[:id])
    @category = params[:category] || :all
    if @category == :all
      @pagy, @posts = pagy @user.posts.eager.asc.all, items: 5
    else
      @pagy, @posts = pagy @user.posts.eager.asc.where(category_id: @category), items: 5
    end
  end
end
