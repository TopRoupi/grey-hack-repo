# app/views/sitemap/index.xml.builder

base_url = "https://#{request.host_with_port}"

xml.instruct! :xml, version: "1.0"
xml.tag! "urlset", "xmlns" => "http://www.sitemaps.org/schemas/sitemap/0.9", "xmlns:image" => "http://www.google.com/schemas/sitemap-image/1.1", "xmlns:video" => "http://www.google.com/schemas/sitemap-video/1.1" do
  @pages.each do |page|
    xml.url do
      xml.loc base_url + page
    end
  end
  Post.find_each do |post|
    xml.url do
      xml.loc base_url + post_path(post)
      xml.lastmod post.updated_at.xmlschema
    end
  end
  Category.find_each do |category|
    xml.url do
      xml.loc base_url + category_path(category)
      xml.lastmod category.updated_at.xmlschema
    end
  end
  User.find_each do |user|
    xml.url do
      xml.loc base_url + user_path(user)
      xml.lastmod user.updated_at.xmlschema
    end
  end
end
