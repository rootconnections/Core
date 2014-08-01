require 'spec_helper'
require_relative 'setup_webstore_helpers'
require_relative 'setup_webstore_macros'

RSpec.configure do |config|
  config.include Webstore::SetupWebstoreHelpers,  type: :feature
  config.extend Webstore::SetupWebstoreMacros,    type: :feature

  # rspec-rails 3 will no longer automatically infer an example group's spec type
  # from the file location. You can explicitly opt-in to the feature using this
  # config option.
  # To explicitly tag specs without using automatic inference, set the `:type`
  # metadata manually:
  #
  #     describe ThingsController, :type => :controller do
  #       # Equivalent to being in spec/controllers
  #     end
  config.infer_spec_type_from_file_location!
end

