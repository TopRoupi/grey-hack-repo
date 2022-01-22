# frozen_string_literal: true

class HomeController < ApplicationController
  include SortablePosts

  def index
    set_posts

    @posts = @posts.search(params[:query]["title"]) if params[:query]

    @pagy, @posts = pagy @posts
  end
end
