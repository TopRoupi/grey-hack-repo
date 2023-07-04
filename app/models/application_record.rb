# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def stripped_attributes
    attributes.reject { |key| key.to_s.match(/\bid|created_at|updated_at/) }
  end

  #TODO: remove this after https://github.com/rails/rails/issues/48652 is fixed
  def deep_dup
    self
  end
end
