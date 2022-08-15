class Cable
  @@signed_stream_verifier_key = Rails.application.key_generator.generate_key("cable_verifier_key")
  @@signed_stream_verifier = ActiveSupport::MessageVerifier.new(@@signed_stream_verifier_key, digest: "SHA256", serializer: JSON)

  def self.signed_stream_name(stream_name)
    @@signed_stream_verifier.generate(stream_name)
  end

  def self.verified_stream_name(signed_stream_name)
    @@signed_stream_verifier.verified(signed_stream_name)
  end
end
