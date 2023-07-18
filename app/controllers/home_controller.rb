# frozen_string_literal: true

class HomeController < ApplicationController
  include SortablePosts

  def index
    ahoy.track "viewed home"

    meili_query = {filter: [], sort: []}
    meili_query[:filter] += ["published = true", "visibility = 'public'"]


    meili_query[:sort] << case params[:sort]
    in "newest"
      "created_at:desc"
    in "oldest"
      "created_at:asc"
    in "popular"
      "stars_count:desc"
    else
      "created_at:desc"
    end

    if params[:sort] == "popular"
      meili_query[:filter] << case params[:filter]
      in "week"
        "created_at >= #{1.week.ago.to_i} AND created_at < #{Time.now.to_i}"
      in "month"
        "created_at >= #{1.month.ago.to_i} AND created_at < #{Time.now.to_i}"
      in "year"
        "created_at >= #{1.year.ago.to_i} AND created_at < #{Time.now.to_i}"
      else
        ""
      end
    end

    search_param = params[:query]&.fetch("title")
    search_param ||= ""

    @posts = Post.pagy_search(search_param, **meili_query)

    begin
      @pagy, @posts = pagy_meilisearch(@posts, items: 10)
    rescue Pagy::OverflowError
      params[:page] = 1
      retry
    end

    @builds = Build.eager_load(:post).where("\"posts\".\"visibility\" = #{Post.visibilities[:public]} AND builds.published = true").order(created_at: :desc).limit(20)
  end
end
