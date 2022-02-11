# frozen_string_literal: true

class FileJob < ApplicationJob
  queue_as :default

  def perform(build, file_name: "scripts")
    @files_path = "tmp/#{file_name}.zip"

    clear_files

    Zip::File.open(@files_path, create: true) do |zipfile|
      create_files(zipfile, build, only_content: true)
    end

    build.updated = true
    build.files.attach(io: File.open(@files_path), filename: "#{file_name}.zip")

    clear_files
  end

  private

  def create_files(zipfile, build, file_name: nil, path: nil, only_content: false)
    files_path = [path, file_name].compact.join("/")
    zipfile.mkdir(files_path) unless only_content

    build.folders.each do |folder|
      create_files(zipfile, folder, file_name: folder.name, path: files_path.empty? ? nil : files_path)
    end

    build.scripts.each do |script|
      script_path = if files_path.empty?
        script.name
      else
        "#{files_path}/#{script.name}"
      end

      zipfile.get_output_stream(script_path) { |f| f.puts script.content }
    end
  end

  def clear_files
    File.delete(@files_path) if File.exist?(@files_path)
  end
end
