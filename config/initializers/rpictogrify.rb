Rpictogrify.configure do
  # default theme, one of these themes: avataars_female, avataars_male, male_flat, monsters. default is :monsters
  self.theme = :monsters
  # pictogram directory. default is 'public/system'
  self.base_path = "tmp/nfts"
  self.themes_assets_path = Rails.root.join("app", "rpictogrify", "themes")
end

module Rpictogrify
  module Themes
    class Hats < Base
    end
  end
end
