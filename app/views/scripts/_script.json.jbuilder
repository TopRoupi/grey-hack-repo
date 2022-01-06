# frozen_string_literal: true

json.extract! script, :name, :content, :created_at, :updated_at
json.url script_url(script, format: :json)
