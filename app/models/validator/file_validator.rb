# frozen_string_literal: true

class Validator::FileValidator < ActiveModel::Validator
  def validate(record)
    begin
      record.find_build
    rescue NoMethodError
      return
    end
    if record.find_build.published?
      polymorphic_relation = record.instance_of?(Script) ? "scriptable" : "foldable"
      if record.send(polymorphic_relation).send(record.class.to_s.pluralize.downcase).select { |s| s.name == record.name }.size > 1
        record.errors.add(:name, "should be uniq in the same path")
      end
    end
  end
end
