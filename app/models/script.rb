# frozen_string_literal: true

# == Schema Information
#
# Table name: scripts
#
#  id                  :bigint           not null, primary key
#  content             :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  highlighted_content :string
#  name                :string
#  scriptable_type     :string
#  scriptable_id       :bigint
#  old_content         :binary
#  lib                 :boolean
#
class Script < ApplicationRecord
  belongs_to :scriptable, polymorphic: true

  validates_with Validator::FileValidator
  validates :content, presence: true, length: {minimum: 10, maximum: 80_000}
  validates :name, presence: true, length: {minimum: 2, maximum: 24}

  after_commit :touch_scriptable, on: [:create, :destroy]

  def name_with_path
    scriptable.path_list.map(&:path)[1..].push(name).join("/")
  end

  def touch_scriptable
    scriptable.touch unless scriptable.destroyed?
  end

  def extension
    file_extensions = name.split(".")[1..]

    file_extensions[-1]
  end

  def user
    if scriptable.instance_of? Build
      scriptable.post.user
    else
      scriptable.user
    end
  end

  def find_build
    if scriptable.instance_of? Build
      scriptable
    else
      scriptable.find_build
    end
  end
end
