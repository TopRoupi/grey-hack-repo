# frozen_string_literal: true

class Comments::Form::ComponentReflex < ApplicationReflex
  before_reflex :set_commentable
  before_reflex :set_comment, only: [:destroy, :edit, :update]

  def create
    @comment = Comment.new(comment_params)
    @comment.user = current_user
    @comment.commentable = @commentable

    if @comment.save
      update_comment_form

      if @commentable.comments.count == 1
        cable_ready
          .inner_html(selector: dom_id(@commentable, "comments"), html: "")
          .broadcast
      end
      cable_ready
        .insert_adjacent_html(selector: dom_id(@commentable, "comments"), html: render(Comments::Card.new(user: current_user, comment: @comment), layout: false))
        .broadcast
    else
      update_comment_form(comment: @comment)
    end
  end

  def destroy
    @comment.destroy
    cable_ready
      .remove(selector: dom_id(@comment))
      .broadcast
    morph :nothing
  end

  def update
    if @comment.update(comment_params)
      cable_ready
        .morph(selector: dom_id(@comment), html: render(Comments::Card.new(user: current_user, comment: @comment), layout: false))
        .broadcast
      morph :nothing
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
    @commentable = Post.friendly.find(params[:id])
  end

  def set_comment
    @comment = current_user.comments.find(element.dataset["comment-id"])
  end

  def update_comments_box
    morph(dom_id(@commentable, "comments"), render(Comments::List.new(user: current_user, commentable: @commentable)))
  end

  def update_comment_form(form: Comment.new, comment: Comment.new)
    morph(dom_id(form), render(Comments::Form::Component.new(user: current_user, comment: comment)))
  end

  def comment_params
    params.require(:comment).permit(:content)
  end
end
