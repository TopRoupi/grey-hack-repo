# frozen_string_literal: true

class Posts::BuildsCard::Component < ApplicationComponent
  def initialize(post:, edit: false)
    @post = post
    @edit = edit
  end

  def before_render
    @selected_index = session[:selected_build]
    @selected_build = @post.builds[@selected_index] if @selected_index
  end
end
