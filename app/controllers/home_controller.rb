# frozen_string_literal: true

class HomeController < ApplicationController
  include SortablePosts

  def index
    ahoy.track "viewed home"

    if params[:query]
      @posts = Post.pagy_search(params[:query]["title"], filter: ["dd IS NOT NULL"])

      begin
        @pagy, @posts = pagy_meilisearch(@posts, items: 10)
      rescue Pagy::OverflowError
        params[:page] = 1
        retry
      end
    else
      set_posts

      begin
        @pagy, @posts = pagy @posts
      rescue Pagy::OverflowError
        params[:page] = 1
        retry
      end
    end


    @builds = Build.eager_load(:post).where("\"posts\".\"visibility\" = #{Post.visibilities[:public]} AND builds.published = true").order(created_at: :desc).limit(20)
  end
end
