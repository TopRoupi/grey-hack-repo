# frozen_string_literal: true

# == Schema Information
#
# Table name: folders
#
#  id            :bigint           not null, primary key
#  foldable_type :string           not null
#  name          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  foldable_id   :bigint           not null
#
# Indexes
#
#  index_folders_on_foldable  (foldable_type,foldable_id)
#
class Folder < ApplicationRecord
  include Fileable

  belongs_to :foldable, polymorphic: true

  validates_with Validator::FileValidator
  validates :name, presence: true, length: {minimum: 2, maximum: 24}

  after_commit :touch_foldable, on: [:create, :destroy]

  def touch_foldable
    foldable.touch unless foldable.destroyed?
  end

  def user
    if foldable.instance_of? Build
      foldable.post.user
    else
      foldable.user
    end
  end

  def find_build
    if foldable.instance_of? Build
      foldable
    else
      foldable.find_build
    end
  end
end
