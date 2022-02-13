# frozen_string_literal: true

class Posts::BuildsCard::ComponentReflex < ApplicationReflex
  def select
    session[:selected_build] = element.dataset[:index].to_i
  end
end
