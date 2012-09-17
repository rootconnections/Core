require 'spec_helper'

describe WebstoreOrder do
  let(:box) { mock_model Box }
  let(:route) { mock_model Route }
  let(:order) { mock_model Order }
  let(:webstore_order) { Fabricate.build(:webstore_order) }

  subject { webstore_order }

  context 'box information' do
    before do
      box.stub(:big_thumb_url) { 'box.jpg' }
      box.stub(:name) { 'Boxy' }
      box.stub(:price) { 12 }
      box.stub(:description) { 'A box.' }
      webstore_order.stub(:box) { box }
    end

    its(:thumb_url) { should eq('box.jpg') }
    its(:box_name) { should eq('Boxy') }
    its(:box_price) { should eq(12) }
    its(:box_description) { should eq('A box.') }
  end

  context 'route information' do
    before do
      route.stub(:name) { 'A Route' }
      route.stub(:fee) { 2 }
      webstore_order.stub(:route) { route }
    end

    its(:route_name) { should eq('A Route') }
    its(:route_fee) { should eq(2) }
  end

  context 'order information' do
    its(:order_extras_price) { should eq(1) }
    its(:order_price) { should eq(5) }
  end

  context 'state' do
    its(:completed?) { should be_false }
  end
end
