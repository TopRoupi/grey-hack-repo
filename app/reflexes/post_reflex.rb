# frozen_string_literal: true

class PostReflex < ApplicationReflex
  def publish
    post = Post.find_signed(element.dataset[:post_id])
    post.published = true
    post.save!
  end
end
