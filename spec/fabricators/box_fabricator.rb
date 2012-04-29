Fabricator(:box) do
  distributor
  name { sequence(:name) { |i| "Box #{i}" } }
  description { "A description about this box." }
  price 10
  extras_limit 0
end

Fabricator(:box_with_associations, from: :box) do
  distributor!
end

