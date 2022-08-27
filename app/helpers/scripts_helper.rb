# frozen_string_literal: true

module ScriptsHelper
  def file_extension_to_language(extension)
    langs = {
      src: "greyscript",
      txt: "text",
      md: "markdown"
    }

    langs[extension] || "text"
  end
end
