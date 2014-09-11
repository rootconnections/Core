object @customer
attributes :id, :first_name, :last_name, :email, :delivery_service_id

child :address do
  attributes :address_1, :address_2, :suburb, :city, :postcode, :delivery_note, :home_phone, :mobile_phone, :work_phone
end
