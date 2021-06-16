# frozen_string_literal: true

class Comments::Form::ComponentReflex < ApplicationReflex
  before_reflex :set_commentable
  before_reflex :set_comment, only: [:destroy, :edit, :update]

  def create
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
    @comment.destroy
    update_comments_box
  end

  def update
    if @comment.update(comment_params)
      update_comments_box
    else
      update_comment_form(form: @comment, comment: @comment)
    end
  end

  def edit
    update_comment_form(form: @comment, comment: @comment)
  end

  private

  def set_commentable
    # todo: make it work with other commentable types
    @commentable = Post.find(params[:id])
  end

  def set_comment
    @comment = current_user.comments.find(element.dataset["comment-id"])
  end

  def update_comments_box
    morph(dom_id(@commentable, "comments"), render(Comments::List::Component.new(commentable: @commentable)))
  end

  def update_comment_form(form: Comment.new, comment: Comment.new)
    morph(dom_id(form), render(Comments::Form::Component.new(comment: comment)))
  end

  def comment_params
    params.require(:comment).permit(:content)
  end
end
