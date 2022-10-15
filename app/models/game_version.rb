# frozen_string_literal: true

# == Schema Information
#
# Table name: game_versions
#
#  id         :bigint           not null, primary key
#  version    :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class GameVersion < ApplicationRecord
end
