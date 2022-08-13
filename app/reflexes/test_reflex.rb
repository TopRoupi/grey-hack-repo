# frozen_string_literal: true

class TestReflex < ApplicationReflex
  def go
    cable_ready[ApplicationChannel].console_log(message: "Hi!").broadcast_to(Cable.signed_stream_name("test"))
    morph :nothing
  end
end
