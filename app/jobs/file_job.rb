require "zip"

class FileJob < ApplicationJob
  queue_as :default

  def perform(fileable)
    @files_path = create_files(fileable, "fileable_#{fileable.id}")
  end

  private

  def create_files(fileable, file_name, path = "tmp")
    files_path = "#{path}/#{file_name}"
    Dir.mkdir files_path

    fileable.folders.each do |folder|
      create_files(folder, folder.name, files_path)
    end

    fileable.scripts.each do |script|
      script_path = files_path + "/#{script.name}"
      File.open(script_path, "w+") { |file| file.write(script.content) }
    end

    files_path
  end

  def clear_files
    File.delete(@files_path) if File.exist?(@files_path)
  end
end
