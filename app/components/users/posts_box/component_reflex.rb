class Users::PostsBox::ComponentReflex < ApplicationReflex
  def change
    @user = User.find(element.dataset[:user])

    if element.dataset[:category] == "all"
      @category = :all
      @posts = @user.posts.eager_load(:category, :user)
    else
      @category = Category.find(element.dataset[:category])
      @posts = @user.posts.eager_load(:category, :user).where(category: @category)
    end

    morph(dom_id(@user, "posts_box_categories"),
      render(Users::PostsBox::CategoriesList::Component.new(user: @user, categories: Category.all, active_tab: @category)))
    morph(dom_id(@user, "posts_box_list"),
      render(Users::PostsBox::PostsList::Component.new(user: @user, posts: @posts)))
  end
end
