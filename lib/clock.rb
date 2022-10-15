require "clockwork"
require "active_support/time" # Allow numeric durations (eg: 1.minutes)

module Clockwork
  handler do |job|
    puts "Running #{job}"
  end

  every(10.minutes, "query_stats") { `rake pghero:capture_query_stats` }
  every(10.minutes, "space_stats") { `rake pghero:capture_space_stats` }
end
