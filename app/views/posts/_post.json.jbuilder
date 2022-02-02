# frozen_string_literal: true

json.extract! post, :title, :description, :readme, :summary, :created_at, :updated_at
json.sgid post.attachable_sgid
json.content render(
  partial: "posts/post",
  locals: {post: post},
  formats: [:html]
)
json.url post_url(post, format: :json)
