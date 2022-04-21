# frozen_string_literal: true

class Script < ApplicationRecord
  belongs_to :scriptable, polymorphic: true

  validates :content, presence: true, length: {minimum: 10, maximum: 80_000}
  validates :name, presence: true, length: {minimum: 2, maximum: 24}

  after_commit :set_highlighted_content, on: [:create, :update]

  def user
    if scriptable.instance_of? Build
      scriptable.post.user
    else
      scriptable.user
    end
  end

  def set_highlighted_content
    HighlightJob.perform_later(self) unless Digest::SHA256.digest(content) == old_content
  end
end
