class ApplicationTransaction
  include Dry::Transaction

  def self.call(...)
    new.call(...)
  end
end
