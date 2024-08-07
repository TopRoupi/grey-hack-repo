# frozen_string_literal: true

class Pagination < ApplicationComponent
  def initialize(pagy:, reflex: false, html: {})
    @sys_params = html
    @pagy = pagy
    @reflex = reflex
  end

  def link_class(bg = "bg-beaver-700 hover:bg-beaver-600 cursor-pointer")
    "px-2 py-2 w-12 justify-center font-medium flex items-center #{bg}"
  end

  def link_disabled
    "bg-beaver-800"
  end

  def link_active
    "bg-beaver-500"
  end

  def render?
    @pagy.pages > 1
  end
end
