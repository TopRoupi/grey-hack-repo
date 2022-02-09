# frozen_string_literal: true

require "test_helper"

class FileJobTest < ActiveJob::TestCase
  test "set files attachment after create" do
    post = create(:post)
    assert_enqueued_jobs 1, only: FileJob
    perform_enqueued_jobs only: FileJob
    assert_performed_jobs 1, only: FileJob
    post.reload

    refute_nil post.files_attachment
  end

  test "set files attachment after update" do
    post = create(:post)
    perform_enqueued_jobs
    post.reload

    post_old_files = post.files_attachment

    post.scripts.first.content = "new content...."
    post.save
    assert_enqueued_jobs 1, only: FileJob
    perform_enqueued_jobs only: FileJob
    assert_performed_jobs 2, only: FileJob
    post.reload

    refute_equal post.files_attachment, post_old_files
  end
end
