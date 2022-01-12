# frozen_string_literal: true

require "test_helper"

class HighlightJobTest < ActiveJob::TestCase
  test "update script highlighted_content when created" do
    script = create(:post).scripts.first
    assert_enqueued_jobs 1
    perform_enqueued_jobs
    assert_performed_jobs 1
    script.reload

    refute_nil script.highlighted_content
  end

  test "update script highlighted_content when content is updated" do
    script = create(:post).scripts.first
    perform_enqueued_jobs
    script.reload

    old_highlighted_content = script.highlighted_content
    script.content = "new script content ..........."
    script.save
    assert_enqueued_jobs 1
    perform_enqueued_jobs
    assert_performed_jobs 2

    script.reload

    refute_equal script.highlighted_content, old_highlighted_content
  end

  test "does not update highlighted_content when content has not changed after an update" do
    script = create(:post).scripts.first
    perform_enqueued_jobs
    script.reload

    script.update(name: "new name")
    assert_enqueued_jobs 0
  end
end
