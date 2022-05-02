# frozen_string_literal: true

class Folder < ApplicationRecord
  include Fileable

  belongs_to :foldable, polymorphic: true

  validates :name, presence: true, length: {minimum: 2, maximum: 24}

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
