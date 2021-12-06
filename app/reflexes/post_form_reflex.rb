class PostFormReflex < ApplicationReflex
  before_reflex do
    session[:forms] ||= {}
    session[:forms]["Post"] ||= Post.new(controller.send(:post_params))
  end

  def add_script
    session[:forms]["Post"].scripts.build
  end
end
