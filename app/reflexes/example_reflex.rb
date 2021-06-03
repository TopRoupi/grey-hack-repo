class ExampleReflex < ApplicationReflex
  def test
    morph("#render_here", render(Posts::Card::Component.new(post: Post.first), layout: false))
  end
end
