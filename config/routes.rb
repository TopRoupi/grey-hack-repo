# frozen_string_literal: true

Rails.application.routes.draw do
  resources :posts, except: [:index]
  devise_for :users, controllers: {session: "users/sessions"}
  get "home/index"
  root to: "home#index"

  get "posts", to: "home#index"
  get "users/:id", to: "users#show", as: "user"
  get "users/:id/posts", to: "users#posts", as: "user_posts"
  get "categories/:id", to: "categories#show", as: "category"
end
