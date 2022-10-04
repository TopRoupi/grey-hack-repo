class UserPolicy < ApplicationPolicy
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

  def myposts?
    true
  end

  def mygists?
    true
  end

  def posts?
    true
  end

  def unlink_github?
    true
  end
end
