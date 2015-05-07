# Intercom expects #contact_name to be #name,
# swap them so it makes sense.
module Messaging
  class DistributorNameSwap
    def initialize(distributor)
      @distributor = distributor
    end

    def name
      distributor.contact_name
    end

    def business_name
      distributor.name
    end

    def method_missing(method, *args)
      distributor.send(method, *args)
    end

    def respond_to_missing?(method_name, include_private = false)
      distributor.respond_to?(method_name, include_private)
    end

  private

    attr_reader :distributor
  end
end
