BuckyBox::Application.routes.draw do
  devise_for :admins, controllers: { sessions: 'admin/sessions' }
  devise_for :distributors, controllers: { sessions: 'distributor/sessions' }
  devise_for :customers,    controllers: { sessions: 'customer/sessions' }

  root to: 'distributor/dashboard#index'

  namespace :market do
    get ':distributor_parameter_name',                  action: 'store',            as: 'store'
    get ':distributor_parameter_name/buy/:box_id',      action: 'buy',              as: 'buy'
    get ':distributor_parameter_name/customer_details', action: 'customer_details', as: 'customer_details'
    get ':distributor_parameter_name/payment',          action: 'payment',          as: 'payment'
    get ':distributor_parameter_name/success',          action: 'success',          as: 'success'
  end

  namespace :distributor do
    root to: 'dashboard#index'
    get 'dashboard', controller: 'dashboard', action: 'index'
    post 'events/:id/dismiss', controller: 'dashboard', action: 'dismiss_event', as: 'dismiss_event'

    namespace :wizard do
      get 'business'
      get 'boxes'
      get 'routes'
      get 'payment'
      get 'billing'
      get 'success'
    end

    namespace :settings do
      get 'business_information'
      get 'extras'
      get 'boxes'
      get 'routes'
      get 'bank_information'
      get 'invoice_information'
      get 'stock_list'
      get 'reporting'
    end

    resources :distributors,        only: :update
    resource  :bank_information,    only: [:create, :update]
    resource  :invoice_information, only: [:create, :update]
    resources :boxes,               except: [:index]
    resources :extras,              except: [:index, :show]
    resources :routes,              except: [:index, :show]

    resources :line_items, except: [:index, :show, :update] do
      collection do
        put 'bulk_update', action: :bulk_update, as: 'bulk_update'
      end
    end

    resources :deliveries do
      collection do
        get 'date/:date/view/:view',  action: :index,                as: 'date'
        post 'date/:date/reposition', action: :reposition,           as: 'reposition'
        post 'update_status',         action: :update_status,        as: 'update_status'
        post 'make_payment',          action: :make_payment,         as: 'make_payment'
        post 'master_packing_sheet',  action: :master_packing_sheet, as: 'master_packing_sheet'
        post 'export',                action: :export,               as: 'export'
      end
    end

    resources :invoices do
      collection do
        get 'to_send', action: 'to_send', as: 'to_send'
        post 'do_send', action: 'do_send', as: 'do_send'
      end
    end

    resources :payments, only: [:create, :index, :show, :destroy] do
      collection do
        get 'upload_transactions', action: 'upload_transactions', as: 'upload_transactions'
        post 'commit_upload',      action: 'commit_upload',       as: 'commit_upload'
        post 'create_from_csv',    action: 'create_from_csv',     as: 'create_from_csv'
        post 'process_upload',     action: 'process_upload',      as: 'process_upload'
        post 'index',              action: 'match_payments',      as: 'match_payments'
      end

      member do
        put 'process_payments', action: 'process_payments', as: 'process_payments'
      end
    end

    resources :import_transactions, only: [:update] do
      member do
        get 'load_more_rows/:position', action: 'load_more_rows', as: 'load_more_rows'
      end
    end

    resources :import_transaction_lists, only: [:destroy]

    resources :customers do
      collection do
        get 'search',   action: :index, as: 'search'
        get 'tag/:tag', action: :index, as: 'tag'
      end

      member do
        get :send_login_details
      end
    end

    resources :accounts, only: :edit do
      resources :orders, except: [ :index, :show, :destroy ] do
        member do
          put 'deactivate'
          put 'pause'
          post 'remove_pause'
          put 'resume'
          post 'remove_resume'
        end
      end

      resources :boxes do
        member do
          get 'extras'
        end
      end

      member do
        put 'change_balance', action: :change_balance, as: 'change_balance'
        get 'more_transactions/:position', action: :more_transactions, as: 'more_transactions'
        get 'receive_payment', action: :receive_payment, as: 'receive_payment'
        post 'save_payment', action: :save_payment, as: 'save_payment'
      end
    end
  end

  namespace :customer do
    root to: 'dashboard#index'
    get 'dashboard',               controller: 'dashboard', action: 'index'
    get 'order/:order_id/box/:id', controller: 'dashboard', action: 'box'

    resources :customers, only: :update do
      member do
        put 'update_password'
      end
    end

    resource  :address, only: :update
    resources :boxes, only: [:show] do
      member do
        get 'extras'
      end
    end
    resources :orders, only: [ :new, :edit, :create, :update] do
      member do
        put 'pause'
        post 'remove_pause'
        put 'resume'
        post 'remove_resume'
      end
    end
  end

  namespace :admin do
    root to: 'dashboard#index'

    resources :cron_logs, only: :index

    resources :distributors do
      member do
        get 'impersonate'
        get 'customer_import'
        put 'validate_customer_import'
        post 'customer_import_upload'
        get 'invoice'
      end

      collection do
        get 'unimpersonate'
        get 'country_setting/:id', controller: 'distributors', action: 'country_setting'
      end
    end
  end
end
