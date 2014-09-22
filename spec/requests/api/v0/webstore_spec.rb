require "spec_helper"

include ApiHelpers

describe "API v0" do
  describe "webstore" do
    shared_examples_for "a webstore" do
      it "returns the expected attributes" do
        expect(webstore.keys).to match_array model_attributes
      end
    end

    before do
      @distributor ||= Fabricate(:distributor)
      @bank_information ||= Fabricate(:bank_information, distributor: @distributor)
    end

    let(:model_attributes) { %w(active bank_information city cod_payment_message collect_delivery_note collect_phone company_logo company_team_image currency email email_customer_on_new_webstore_order facebook_url id line_items name payment_options phone require_address_1 require_address_2 require_city require_delivery_note require_phone require_postcode require_suburb sidebar_description time_zone) }

    describe "GET /webstore" do
      let(:url) { "#{base_url}/webstore" }
      let(:webstore) { json_response }

      before do
        json_request :get, url, nil, headers
        expect(response).to be_success
      end

      it_behaves_like "an authenticated API", :get
      it_behaves_like "a webstore"

      it "returns the webstore" do
        expect(json_response["id"]).to eq @distributor.parameter_name
      end
    end
  end
end
