# frozen_string_literal: true

require "aws-sdk-s3"

namespace :s3_storage do
  desc "Remove blobs not associated with any attachment"
  task remove_orphan_blobs: :environment do
    ActiveStorage::Blob.where.not(id: ActiveStorage::Attachment.select(:blob_id)).find_each do |blob|
      puts("Deleting Blob: #{blob.key}")
      blob.purge
    end
  end

  desc "Remove files not associated with any blob"
  task remove_orphan_files: :environment do
    s3 = Aws::S3::Resource.new(
      access_key_id: Rails.application.credentials.dig(:aws, :access_key_id),
      secret_access_key: Rails.application.credentials.dig(:aws, :secret_access_key),
      region: "sa-east-1"
    )

    blobs = ActiveStorage::Blob.all.map do |blob|
      blob.key
    end

    s3_blobs = s3.bucket("greyhackbucket").objects

    s3_blobs.each do |object|
      if !blobs.any?(object.key)
        object.delete
      end
    end
  end
end
