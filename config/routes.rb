# frozen_string_literal: true

Rails.application.routes.draw do
  resources :posts, except: [:index]
  devise_for :users, controllers: {session: "users/sessions"}
  get "home/index"
  root to: "home#index"

  get "posts", to: "home#index"
  get "categories/:id", to: "categories#show", as: "category"
  get "scripts/:id", to: "scripts#show", as: "script"
end
