# frozen_string_literal: true

require "test_helper"

class FileJobTest < ActiveJob::TestCase
  setup do
    @build = build(:post).builds.first
  end

  test "set files attachment after create" do
    @build.save
    assert_enqueued_jobs 1, only: FileJob
    perform_enqueued_jobs only: FileJob
    assert_performed_jobs 1, only: FileJob
    @build.reload

    refute_nil @build.files_attachment
  end

  test "set files attachment after update" do
    @build.save
    perform_enqueued_jobs
    @build.reload

    build_old_files = @build.files_attachment

    @build.scripts.first.content = "new content...."
    @build.save
    assert_enqueued_jobs 1, only: FileJob
    perform_enqueued_jobs only: FileJob
    assert_performed_jobs 2, only: FileJob
    @build.reload

    refute_equal @build.files_attachment, build_old_files
  end
end
