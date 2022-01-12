# frozen_string_literal: true

class HighlightJob < ApplicationJob
  queue_as :default

  def perform(script)
    File.open("source#{script.id}.src", "w+") { |file| file.write(script.content) }
    script.highlighted_content = `./highlight source#{script.id}.src`
    script.old_content = Digest::SHA256.digest(script.content)
    script.save
    File.delete("source#{script.id}.src") if File.exist?("source#{script.id}.src")
  end
end
