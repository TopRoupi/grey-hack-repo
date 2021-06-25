# frozen_string_literal: true

class HomeController < ApplicationController
  include SortablePosts

  def index
    set_posts

    @pagy, @posts = pagy @posts
  end
end
