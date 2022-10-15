# frozen_string_literal: true

# == Schema Information
#
# Table name: stars
#
#  id            :bigint           not null, primary key
#  user_id       :bigint           not null
#  starable_type :string           not null
#  starable_id   :bigint           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
require "test_helper"

class StarTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
