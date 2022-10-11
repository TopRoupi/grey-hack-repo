# frozen_string_literal: true

class FileDiff < ApplicationComponent
  attr_accessor :before_content, :after_content, :file_name

  def initialize(before_script:, after_script:)
    @before_script = before_script
    @after_script = after_script

    @before_content = @before_script&.content || ""
    @after_content = @after_script&.content || ""

    main_file = @before_script || @after_script
    @file_name = main_file.name_with_path
  end
end
