# frozen_string_literal: true

require "sidekiq/web"

Rails.application.routes.draw do
  resources :gists
  resources :scripts, only: [:show, :edit, :update]
  resources :folders, only: [:edit, :update]
  resources :builds, only: [:destroy]
  resources :categories, only: [:show]

  resources :invites, only: [:create, :destroy]
  patch "invites/:id/accept", to: "invites#accept", as: "invite_accept"

  resources :guilds, only: [:index, :new, :create, :show, :edit, :update, :destroy]
  get "guilds/:id/manager", to: "guilds#manager", as: "guild_manager"

  resources :announcements, only: [:create, :update, :destroy, :edit]

  resources :posts, except: [:index]
  get "posts", to: "home#index"
  patch "posts/:id/publish", to: "posts#publish", as: "post_publish"
  get "posts/:id/builds", to: "posts#builds", as: "post_builds"

  patch "builds/:id/publish", to: "builds#publish", as: "build_publish"
  get "builds/:id/diff", to: "builds#diff", as: "build_diff"
  devise_for :users, controllers: {sessions: "users/sessions", registrations: "users/registrations", omniauth_callbacks: "users/omniauth_callbacks"}
  get "users/:id/posts", to: "users#posts", as: "user_posts"
  get "users/:id", to: "users#show", as: "user"
  get "users", to: "users#index", as: "users"
  patch "users/:id/unlink_github", to: "users#unlink_github", as: "user_unlink_github"
  get "myposts", to: "users#myposts", as: "my_posts"
  get "mygists", to: "users#mygists", as: "my_gists"

  get "home/index"
  root to: "home#index"
  get "get_supporter", to: "checkouts#get_supporter", as: "supporter_checkout"
  get "npc_decipher", to: "npc_decipher#index", as: "npc_decipher"

  get "compressor", to: "compressor#index", as: "compressor"
  get "gen_img", to: "gen_img#index", as: "gen_img"

  authenticate :user, ->(user) { user.admin? } do
    mount PgHero::Engine, at: "pghero"
    mount Sidekiq::Web, at: "sidekiq"
    mount Blazer::Engine, at: "blazer"
  end

  get "/sitemap.xml", to: "sitemap#index", format: "xml", as: :sitemap
end
