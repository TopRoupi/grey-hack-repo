# frozen_string_literal: true

module SortablePosts
  extend ActiveSupport::Concern

  protected

  def set_posts
    params[:sort] ||= "newest"
    params[:filter] ||= "all"

    sort = []
    sort << {stars_count: :desc} if params[:sort] == "popular"
    sort << {created_at: :desc} if params[:sort] == "newest"
    sort << {created_at: :asc} if params[:sort] == "oldest"

    filter = {}
    if params[:sort] == "popular"
      filter[:created_at] = (1.week.ago)..Time.now if params[:filter] == "week"
      filter[:created_at] = (1.month.ago)..Time.now if params[:filter] == "month"
      filter[:created_at] = (1.year.ago)..Time.now if params[:filter] == "year"
    end

    @posts = policy_scope(Post).published.eager.order(sort).where(filter).public_visibility
  end
end
