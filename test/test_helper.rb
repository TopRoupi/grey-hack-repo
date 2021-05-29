# frozen_string_literal: true

ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

require "shoulda/context"

class ActiveSupport::TestCase
  parallelize(workers: :number_of_processors)

  include FactoryBot::Syntax::Methods
  include Devise::Test::IntegrationHelpers
end

class ActionController::TestCase
  Devise::Test::ControllerHelpers
end

