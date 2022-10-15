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
class Star < ApplicationRecord
  belongs_to :user
  belongs_to :starable, polymorphic: true, counter_cache: true

  after_commit :touch_starable, on: [:create, :destroy]

  def touch_starable
    starable.touch unless starable.destroyed?
  end
end
