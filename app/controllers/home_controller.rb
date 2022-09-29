# frozen_string_literal: true

class HomeController < ApplicationController
  include SortablePosts

  def index
    set_posts
    @posts = @posts.search(params[:query]["title"]) if params[:query]

    begin
      @pagy, @posts = pagy @posts
    rescue Pagy::OverflowError
      params[:page] = 1
      retry
    end

    @builds = Build.eager_load(:post).where("\"posts\".\"visibility\" = #{Post.visibilities[:public]}").order(created_at: :desc).limit(20)
  end
end
