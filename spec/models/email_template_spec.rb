require 'spec_helper'

describe EmailTemplate do
  describe "#valid?" do
    it "validates presence of attributes" do
      template = EmailTemplate.new "", ""

      template.should_not be_valid
      template.errors.join.should include "Subject", "Body", "blank"
    end
  end

  describe "#unknown_keywords" do
    it "returns unknown keywords" do
      template = EmailTemplate.new "Hey {you}", <<-BODY
        Hi {first_name},

        Your are {age} years old!
        Your balance is {account_balance}.
      BODY

      template.unknown_keywords.should eq %w(you age)
    end
  end

  describe "#personalise" do
    it "replaces keywords" do
      customer = Fabricate(:customer, first_name: "Joe", last_name: "Dalton")
      Fabricate(:address, customer: customer, address_1: "My Street")

      template = EmailTemplate.new "Hi {first_name}", <<-BODY
        Hey {first_name}!

        Your balance is {account_balance} and your address is:
        {address}

        Looking forward to see the {last_name} family!
      BODY

      personalised_email = template.personalise(customer)
      personalised_email.subject.should eq "Hi Joe"
      personalised_email.body.should eq <<-BODY
        Hey Joe!

        Your balance is $0.00 and your address is:
        My Street, Suburb, City

        Looking forward to see the Dalton family!
      BODY
    end
  end
end
