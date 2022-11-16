# == Schema Information
#
# Table name: guilds_users
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  guild_id   :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_guilds_users_on_guild_id  (guild_id)
#  index_guilds_users_on_user_id   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (guild_id => guilds.id)
#  fk_rails_...  (user_id => users.id)
#
require "test_helper"

class GuildsUserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
