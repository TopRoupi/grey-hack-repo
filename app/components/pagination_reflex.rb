# frozen_string_literal: true

class PaginationReflex < ApplicationReflex
  def paginate
    page = element.dataset[:page].to_i

    uri = URI.parse([request.base_url, request.path].join)
    uri.query = {page: page}.to_query

    params[:page] = page

    # cable_ready
    #   .push_state(url: uri.to_s)
  end
end
