# frozen_string_literal: true

class Star < ApplicationRecord
  belongs_to :user
  belongs_to :starable, polymorphic: true, counter_cache: true

  after_commit :touch_starable, on: [:create, :destroy]

  def touch_starable
    starable.touch unless starable.destroyed?
  end
end
