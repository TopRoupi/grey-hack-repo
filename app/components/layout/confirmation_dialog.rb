# frozen_string_literal: true

class Layout::ConfirmationDialog < ApplicationComponent
  renders_one :button, lambda { |**kwargs, &block|
    @button_args = kwargs
    @button_content = block
  }

  renders_one :action, lambda { |**kwargs, &block|
    @action_args = kwargs
    @action_content = block
  }

  renders_one :title

  def initialize(**kwargs)
    @modal_args = kwargs
  end
end
