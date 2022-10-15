# frozen_string_literal: true

# == Schema Information
#
# Table name: stars
#
#  id            :bigint           not null, primary key
#  starable_type :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  starable_id   :bigint           not null
#  user_id       :bigint           not null
#
# Indexes
#
#  index_stars_on_starable  (starable_type,starable_id)
#  index_stars_on_user_id   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
class Star < ApplicationRecord
  belongs_to :user
  belongs_to :starable, polymorphic: true, counter_cache: true

  after_commit :touch_starable, on: [:create, :destroy]

  def touch_starable
    starable.touch unless starable.destroyed?
  end
end
