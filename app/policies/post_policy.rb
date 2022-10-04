class PostPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def index?
    true
  end

  def show?
    return false if record.published == false
    return true if record.published? && record.public_visibility? || record.not_listed_visibility?
    return true if record.user == user
    false
  end

  def new?
    !user.nil?
  end

  def create?
    !user.nil?
  end

  def edit?
    user == record.user
  end

  def builds?
    user == record.user
  end

  def update?
    user == record.user
  end

  def publish?
    user == record.user
  end

  def destroy?
    user == record.user
  end
end
