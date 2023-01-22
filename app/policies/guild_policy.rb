class GuildPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def index?
    true
  end

  def show?
    true
  end

  def new?
    return false if user.nil?
    return false if user.guild
    true
  end

  def edit?
    record.user == user
  end

  def manager?
    record.user == user
  end

  def create?
    return false if user.nil?
    return false if user.guild
    true
  end

  def update?
    record.user == user
  end

  def destroy?
    record.user == user
  end
end
