class NftJob < ApplicationJob
  queue_as :default

  def perform(user)
    nft_path = Rpictogrify.generate user.name, theme: :hats

    user.nft.attach(io: File.open(nft_path), filename: "#{user.name}_nft.svg")
  end
end
