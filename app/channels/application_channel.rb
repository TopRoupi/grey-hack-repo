# frozen_string_literal: true

class ApplicationChannel < ApplicationCable::Channel
  def subscribed
    # puts "application channel"
    # puts params
    # stream_for params[:key]
    stream_from "application-stream"
  end
end
