class ScriptPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def show?
    true
  end

  def edit?
    record.user == user && record.find_build.published? == false
  end

  def update?
    record.user == user && record.find_build.published? == false
  end
end
