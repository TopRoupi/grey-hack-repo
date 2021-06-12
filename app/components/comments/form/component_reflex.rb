# frozen_string_literal: true

class Comments::Form::ComponentReflex < ApplicationReflex
  def create
    @commentable = Post.find(params[:id])

    @comment = Comment.new(comment_params)
    @comment.user = current_user
    @comment.commentable = @commentable

    if @comment.save
      morph(dom_id(@commentable, "comments"), render(Comments::List::Component.new(commentable: @commentable)))
      morph(dom_id(Comment.new), render(Comments::Form::Component.new))
    else
      morph(dom_id(@comment), render(Comments::Form::Component.new(comment: @comment)))
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:content)
  end
end
