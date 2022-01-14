class FileJob < ApplicationJob
  queue_as :default

  def perform(fileable)
    @files_path = "tmp/#{fileable.title}.zip"

    Zip::File.open(@files_path, create: true) do |zipfile|
      create_files(zipfile, fileable, only_content: true)
    end

    fileable.updated = true
    fileable.files.attach(io: File.open(@files_path), filename: "#{fileable.title}.zip")
  end

  private

  def create_files(zipfile, fileable, file_name: nil, path: nil, only_content: false)
    files_path = [path, file_name].compact.join("/")
    zipfile.mkdir(files_path) unless only_content

    fileable.folders.each do |folder|
      create_files(zipfile, folder, file_name: folder.name, path: files_path.empty? ? nil : files_path)
    end

    fileable.scripts.each do |script|
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
