# frozen_string_literal: true

class HomeController < ApplicationController
  def index
    @pagy, @posts = pagy Post.eager.asc.all
  end
end
