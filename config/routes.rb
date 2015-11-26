Rails.application.routes.draw do

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  root 'pages#home'

  # api database output
  namespace :api do
    resources :categories, only: [:index]
    resources :cities, only: [:index]
    resources :groups, only: [:index]
    resources :maps, only: [:index]
  end

  # map page
  get '/map' => 'pages#map'



  resources :pages

end
