# frozen_string_literal: true

class Users::Card < ApplicationComponent
  def initialize(user:)
    @user = user
  end
end
