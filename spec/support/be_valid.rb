RSpec::Matchers.define :be_valid do
  match(&:valid?)

  failure_message_for_should do |actual|
    "expected that #{actual} would be valid (errors: #{actual.errors.full_messages.join(', ')})"
  end

  failure_message_for_should_not do |actual|
    "expected that #{actual} would not be valid"
  end

  description do
    "be valid"
  end
end
