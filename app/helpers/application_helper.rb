# frozen_string_literal: true

module ApplicationHelper
  include UsersHelper
  include Pagy::Frontend

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

    options = options.join "&"

    "#{path}?#{options}"
  end

  def path_params(path)
    _, path_options = path.split "?"

    if path_options
      path_options = path_options.split "&"
      path_options.map { |param| param.split "=" }.to_h
    end
  end
end
