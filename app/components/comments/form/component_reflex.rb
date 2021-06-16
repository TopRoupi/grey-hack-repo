# frozen_string_literal: true

class Comments::Form::ComponentReflex < ApplicationReflex
  def create
    # todo: make it work with other types of commentables
    @commentable = Post.find(params[:id])

    @comment = Comment.new(comment_params)
    @comment.user = current_user
    @comment.commentable = @commentable

    if @comment.save
      update_comments_box
      update_comment_form
    else
      update_comment_form(comment: @comment)
    end
  end

  def destroy
    @commentable = Post.find(params[:id])

    @comment = current_user.comments.find(element.dataset["comment_id"])
    @comment.destroy
    update_comments_box
  end

  private

  def update_comments_box
    morph(dom_id(@commentable, "comments"), render(Comments::List::Component.new(commentable: @commentable)))
  end

  def update_comment_form(form_id: Comment.new, comment: Comment.new)
    morph(dom_id(form_id), render(Comments::Form::Component.new(comment: comment)))
  end

  def comment_params
    params.require(:comment).permit(:content)
  end
end
