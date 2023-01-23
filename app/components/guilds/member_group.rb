# frozen_string_literal: true

class Guilds::MemberGroup < ApplicationComponent
  def initialize(users:)
    @users = users
  end
end
