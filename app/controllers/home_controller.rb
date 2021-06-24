# frozen_string_literal: true

class HomeController < ApplicationController
  def index
    params[:filter] ||= "newest"

    options = []

    options << {stars_count: :desc} if params[:filter] == "popular"
    options << {created_at: :desc}

    @pagy, @posts = pagy Post.eager.order(options)
  end
end
