# frozen_string_literal: true

class PostReflex < ApplicationReflex
  def publish
    post = Post.find_signed(element.dataset[:post_id])
    post.published = true
    post.save!
  end

  def set_lib_form
    morph :nothing

    if params[:post][:lib] == "1"
      cable_ready.add_css_class(selector: "#category_id_input", name: "hidden")
    else
      cable_ready.remove_css_class(selector: "#category_id_input", name: "hidden")
    end
  end
end
