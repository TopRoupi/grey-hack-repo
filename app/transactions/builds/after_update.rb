class Builds::AfterUpdate < ApplicationTransaction
  include Dry::Transaction

  check :check_if_build_files_has_changed
  tee :save_preprocessed_export_string
  tee :set_files

  def check_if_build_files_has_changed(build)
    build.preprocessed_export_string != build.export_string
  end

  def save_preprocessed_export_string(build)
    build.update preprocessed_export_string: build.export_string
  end

  def set_files(build)
    FileJob.perform_later(build, file_name: "#{build.post.title} | #{build.name}")
  end
end
