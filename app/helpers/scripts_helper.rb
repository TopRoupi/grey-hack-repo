# frozen_string_literal: true

module ScriptsHelper
  def file_extension_to_language(extension)
    langs = {
      src: "greyscript",
      txt: "text",
      md: "markdown",
      html: "html"
    }

    langs[extension] || "text"
  end
end
