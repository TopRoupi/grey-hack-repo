# frozen_string_literal: true

# == Schema Information
#
# Table name: folders
#
#  id            :bigint           not null, primary key
#  foldable_type :string           not null
#  foldable_id   :bigint           not null
#  name          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
require "test_helper"

class FolderTest < ActiveSupport::TestCase
  setup do
    @folder = build :folder
  end
end
