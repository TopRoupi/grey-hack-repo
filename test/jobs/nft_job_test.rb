require "test_helper"

class NftJobTest < ActiveJob::TestCase
  setup do
    @user = build(:user)
  end

  test "update user nft when created" do
    @user.save
    assert_enqueued_jobs 1, only: NftJob
    perform_enqueued_jobs
    assert_performed_jobs 1, only: NftJob
    @user.reload

    refute_nil @user.nft
  end
end
