# frozen_string_literal: true

class PostReflex < ApplicationReflex
  def publish
    post = Post.find_signed(element.dataset[:post_id])
    post.published = true
    post.save!
  end

  def change_visibility
    post = Post.find_signed(element.dataset[:post_id])
    new_value = element.value

    post.update! visibility: new_value
  end
end
