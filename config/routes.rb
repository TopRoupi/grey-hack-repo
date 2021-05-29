# frozen_string_literal: true

Rails.application.routes.draw do
  resources :posts
  devise_for :users, controllers: {session: "users/sessions"}
  get "home/index"
  root to: "home#index"
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
