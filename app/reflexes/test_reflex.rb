# frozen_string_literal: true

class TestReflex < ApplicationReflex
  def go
    cable_ready["application-stream"].console_log(message: "Hi!").broadcast
    morph :nothing
  end
end
