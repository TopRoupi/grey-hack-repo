# frozen_string_literal: true

class HighlightJob < ApplicationJob
  queue_as :default

  def perform(script)
    @file_path = "tmp/source#{script.id}.src"
    clear_files
    File.open(@file_path, "w+") { |file| file.write(script.content) }
    script.highlighted_content = `./highlight #{@file_path}`
    script.old_content = Digest::SHA256.digest(script.content)
    script.save
    clear_files
  end

  private

  def clear_files
    File.delete(@file_path) if File.exist?(@file_path)
  end
end
