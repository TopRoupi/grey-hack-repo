# frozen_string_literal: true

class HomeController < ApplicationController
  def index
    @pagy, @posts = pagy Post.eager_load(:category, :user, :stars).order(updated_at: :desc).all
  end
end
