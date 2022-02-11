class Build < ApplicationRecord
  attr_accessor :updated # required to prevent the set_files/Filejob from infinite looping
  belongs_to :post
  include Fileable
  has_one_attached :files
  after_commit :set_files, on: [:update, :create]

  def set_files
    FileJob.perform_later(self) unless @updated
  end
end
