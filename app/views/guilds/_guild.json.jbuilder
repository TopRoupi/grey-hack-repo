json.extract! gist, :id, :name, :description, :registration_info, :created_at, :updated_at
json.url gist_url(gist, format: :json)
