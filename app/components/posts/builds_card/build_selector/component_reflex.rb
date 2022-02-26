# frozen_string_literal: true

class Posts::BuildsCard::BuildSelector::ComponentReflex < ApplicationReflex
  def select
    session[:selected_build] = element.dataset[:index].to_i
  end
end
