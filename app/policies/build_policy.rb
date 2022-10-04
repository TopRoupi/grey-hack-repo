class BuildPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def publish?
    user == record.post.user
  end

  def destroy?
    user == record.post.user
  end

  def diff?
    return true if record.post.visibility != Post.visibilities[:private] && record.published?
    return true if record.published? == false && user == record.post.user
    false
  end
end
