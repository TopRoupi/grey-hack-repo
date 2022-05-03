# frozen_string_literal: true

require "sidekiq/web"

Rails.application.routes.draw do
  get "folders/edit"
  get "folders/update"
  get "npc_decipher", to: "npc_decipher#index", as: "npc_decipher"
  resources :posts, except: [:index]
  resources :scripts, only: [:show, :edit, :update]
  resources :folders, only: [:edit, :update]
  resources :builds, only: [:create, :update, :destroy]
  devise_for :users, controllers: {session: "users/sessions"}
  get "home/index"
  root to: "home#index"

  get "get_supporter", to: "checkouts#get_supporter", as: "supporter_checkout"

  get "posts", to: "home#index"
  get "posts/:id/builds", to: "posts#builds", as: "post_builds"
  get "users/:id/posts", to: "users#posts", as: "user_posts"
  get "users/:id", to: "users#show", as: "user"
  get "users", to: "users#index", as: "users"
  get "myposts", to: "users#myposts", as: "my_posts"
  get "categories/:id", to: "categories#show", as: "category"

  authenticate :user, ->(user) { user.admin? } do
    mount Sidekiq::Web => "/sidekiq"
  end

  get "/sitemap.xml", to: "sitemap#index", format: "xml", as: :sitemap
end
