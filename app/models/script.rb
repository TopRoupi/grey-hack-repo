# frozen_string_literal: true

class Script < ApplicationRecord
  belongs_to :post

  validates :content, presence: true, length: {minimum: 10, maximum: 80_000}
  validates :name, presence: true, length: {minimum: 2, maximum: 24}

  after_commit :set_highlighted_content, on: [:create, :update]

  def set_highlighted_content
    HighlightJob.perform_later(self) unless content == old_content
  end
end
