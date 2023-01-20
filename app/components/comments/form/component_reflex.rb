# frozen_string_literal: true

class Comments::Form::ComponentReflex < ApplicationReflex
  before_reflex :set_commentable
  before_reflex :set_comment, only: [:destroy, :edit, :update, :cancel_edit]

  def create
    @comment = Comment.new(comment_params)
    @comment.user = current_user
    @comment.commentable = @commentable

    if @comment.save
      update_comment_form

      if @commentable.comments.count == 1
        cable_ready
          .add_css_class(selector: "#empty_box", name: "hidden")
          .broadcast
      end
      cable_ready
        .insert_adjacent_html(selector: dom_id(@commentable, "comments"), html: render(Comments::Card.new(user: current_user, comment: @comment), layout: false))
        .broadcast
    else
      update_comment_form(comment: @comment)
    end
  end

  def respond
    comment = Comment.find(element.dataset["comment-id"])

    cable_ready.scroll_into_view(selector: dom_id(Comment.new))
    update_comment_form(form: Comment.new, comment: Comment.new, responding: comment)
  end

  def destroy
    @comment.destroy

    if @commentable.comments.count == 0
      cable_ready
        .remove_css_class(selector: "#empty_box", name: "hidden")
        .broadcast
    end

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
    update_comment_form(form: @comment, comment: @comment, responding: @comment.response)
  end

  def cancel_edit
    cable_ready
      .morph(selector: dom_id(@comment), html: render(Comments::Card.new(user: current_user, comment: @comment), layout: false))
      .broadcast
    morph :nothing
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

  def update_comment_form(form: Comment.new, comment: Comment.new, responding: nil)
    morph(dom_id(form), render(Comments::Form::Component.new(user: current_user, comment: comment, responding: responding)))
  end

  def comment_params
    params.require(:comment).permit(:content, :response_id)
  end
end
