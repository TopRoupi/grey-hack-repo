# frozen_string_literal: true

json.extract! post, :title, :description, :readme, :summary, :created_at, :updated_at
json.url post_url(post, format: :json)
