class FolderPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def edit?
    user == record.find_build.post.user
  end

  def update?
    user == record.find_build.post.user
  end
end
