module SortablePosts
  extend ActiveSupport::Concern

  protected

  def set_posts
    params[:sort] ||= "newest"
    params[:filter] ||= "all"

    sort = []
    sort << {stars_count: :desc} if params[:sort] == "popular"
    sort << {created_at: :desc}

    filter = {}
    filter[:created_at] = (1.week.ago)..Time.now if params[:filter] == "week"
    filter[:created_at] = (1.month.ago)..Time.now if params[:filter] == "month"
    filter[:created_at] = (1.year.ago)..Time.now if params[:filter] == "year"

    @posts = Post.eager.order(sort).where(filter)
  end
end
