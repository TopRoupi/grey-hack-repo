# frozen_string_literal: true

class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def stripped_attributes
    attributes.reject { |key| key.to_s.match(/\bid|created_at|updated_at/) }
  end
end
