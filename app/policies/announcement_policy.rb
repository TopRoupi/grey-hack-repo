class AnnouncementPolicy < ApplicationPolicy
  class Scope < Scope
    def resolve
      scope.all
    end
  end

  def create?
    record.guild.all_members.any? user
  end

  def destroy?
    user == record.user
  end

  def edit?
    user == record.user
  end

  def update?
    user == record.user
  end
end
