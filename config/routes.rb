# frozen_string_literal: true

require "sidekiq/web"

Rails.application.routes.draw do
  get "npc_decipher", to: "npc_decipher#index", as: "npc_decipher"
  resources :posts, except: [:index]
  devise_for :users, controllers: {session: "users/sessions"}
  get "home/index"
  root to: "home#index"

  get "posts", to: "home#index"
  get "users/:id", to: "users#show", as: "user"
  get "categories/:id", to: "categories#show", as: "category"
  get "scripts/:id", to: "scripts#show", as: "script"

  authenticate :user, ->(user) { user.admin? } do
    mount Sidekiq::Web => "/sidekiq"
  end
end
