# frozen_string_literal: true

module ApplicationHelper
  include UsersHelper
  include ScriptsHelper
  include Pagy::Frontend

  def markdown(content)
    return "" if content.blank?

    markdown = Redcarpet::Markdown.new(Redcarpet::Render::XHTML,
      autolink: true,
      space_after_headers: true,
      tables: true)
    markdown.render(content)
    sanitize(markdown.render(content)).html_safe
  end

  def supporter_badge(**kwargs)
    kwargs[:class] = "font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 to-indigo-600 #{kwargs[:class]}"
    content_tag(:span, "supporter", kwargs)
  end

  def published_status(obj, tag: :span, **kwargs)
    content = obj.published? ? "published" : "not published"
    kwargs[:class] = obj.published? ? "text-green-400" : "text-red-400"
    content_tag(tag, content, kwargs)
  end

  def publishable_status(obj)
    obj.published = true

    content = obj.valid? ? "ready to publish" : "not ready to published"
    klass = obj.valid? ? "text-green-400" : "text-red-400"

    obj.published = false
    obj.valid?
    content_tag(:span, content, class: klass)
  end

  def default_meta_tags
    {
      site: "Grey Repo",
      reverse: true,
      separator: "|",
      description: "GreyHack game scripts repository.",
      keywords: "scripts, miniscript, greyscript, hacking, tools",
      canonical: request.original_url,
      noindex: !Rails.env.production?,
      icon: [
        {href: image_url("icon.ico")},
        {href: image_url("logo3.svg"), rel: "apple-touch-icon", sizes: "180x180", type: "image/svg"}
      ],
      og: {
        site_name: "Grey Repo",
        title: @post&.title || "Grey Repo",
        description: @post&.summary || "GreyHack game scripts repository.",
        type: "website",
        url: request.original_url,
        image: image_url("image.png")
      }
    }
  end

  def path_to(path, options)
    path_params = path_params(path)
    path = path.split("?").first

    options = options.map do |k, v|
      [k.to_s, v.to_s]
    end

    options = options.to_h

    options = path_params.merge!(options) if path_params

    options = options.map do |key, value|
      "#{key}=#{value}"
    end

    options = options.join("&")

    "#{path}?#{options}"
  end

  def path_params(path)
    _, path_options = path.split("?")

    if path_options
      path_options = path_options.split("&")
      path_options.map do |param|
        key, value = param.split("=")
        value ||= ""
        [key, value]
      end.to_h
    end
  end
end
