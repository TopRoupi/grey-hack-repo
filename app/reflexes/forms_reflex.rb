# frozen_string_literal: true

class FormsReflex < ApplicationReflex
  def dicard_session_forms
    session.delete :forms
  end

  def discard_session_form
    session[:forms]&.delete element.dataset[:form]
  end
end
