# frozen_string_literal: true

require "test_helper"

class HighlightJobTest < ActiveJob::TestCase
  setup do
    @script = build(:post).builds.first.scripts.first
  end

  test "update script highlighted_content when created" do
    @script.save
    assert_enqueued_jobs 1, only: HighlightJob
    perform_enqueued_jobs
    assert_performed_jobs 1, only: HighlightJob
    @script.reload

    refute_nil @script.highlighted_content
  end

  test "update script highlighted_content when content is updated" do
    @script.save
    perform_enqueued_jobs
    @script.reload

    old_highlighted_content = @script.highlighted_content
    @script.content = "new script content ..........."
    @script.save
    assert_enqueued_jobs 1, only: HighlightJob
    perform_enqueued_jobs
    assert_performed_jobs 2, only: HighlightJob

    @script.reload

    refute_equal @script.highlighted_content, old_highlighted_content
  end

  test "does not update highlighted_content when content has not changed after an update" do
    @script.save
    perform_enqueued_jobs
    @script.reload

    @script.update(name: "new name")
    assert_enqueued_jobs 0, only: HighlightJob
  end
end
