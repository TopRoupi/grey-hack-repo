# frozen_string_literal: true

Rails.application.routes.draw do
  resources :posts, except: [:index]
  devise_for :users, controllers: {session: "users/sessions"}
  get "home/index"
  root to: "home#index"

  get "posts", to: "home#index"
  get "users/:id", to: "users#show", as: "user"
  get "categories/:id", to: "categories#show", as: "category"

  # scope ActiveStorage.routes_prefix do
  #   get "/blobs/proxy/:signed_id/*filename" => "dumb_storage/blobs/proxy#show"
  #   get "/blobs/redirect/:signed_id/*filename" => "dumb_storage/blobs/proxy#show"
  # end
end
