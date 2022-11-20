class InvitePolicy < ApplicationPolicy
  def create?
    if record.guild.nil?
      false
    else
      record.guild.user == user
    end
  end

  def accept?
    if user.nil? || user != record.user
      false
    else
      true
    end
  end

  def destroy?
    if user.nil? || user != record.user
      false
    else
      true
    end
  end
end
