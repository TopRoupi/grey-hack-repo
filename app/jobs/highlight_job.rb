class HighlightJob < ApplicationJob
  queue_as :default

  def perform(script)
    File.open("source.src", "w+") { |file| file.write(script.content) }
    script.highlighted_content = `./highlight source.src`
    script.old_content = script.content
    script.save
  end
end
