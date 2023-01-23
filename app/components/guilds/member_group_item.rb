# frozen_string_literal: true

class Guilds::MemberGroupItem < ApplicationComponent
  def initialize(user: nil, placeholder: "...")
    @user = user
    @placeholder = placeholder
  end
end
