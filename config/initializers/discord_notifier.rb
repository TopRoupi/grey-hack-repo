Discord::Notifier.setup do |config|
  config.url = Rails.application.credentials[:discord_url]

  # Defaults to `false`
  config.wait = false
end
