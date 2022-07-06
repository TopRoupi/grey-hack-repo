# frozen_string_literal: true

module UsersHelper
  def user_avatar(user)
    (!user&.avatar.blank? && user&.avatar) || (user&.nft_attachment && rails_blob_path(user&.nft_attachment)) || default_avatar
  end

  def current_user_avatar
    if current_user
      user_avatar(current_user)
    else
      default_avatar
    end
  end

  private

  def default_avatar
    image_url("user.png")
  end
end
