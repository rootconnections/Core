class CustomerDecorator < Draper::Decorator
  delegate_all

  delegate :name, to: :delivery_service, prefix: true
  delegate :address_1, :address_2, :suburb, :city, :postcode, :delivery_note, :mobile_phone, :home_phone, :work_phone, to: :address

  def badge
    link = Rails.application.routes.url_helpers.distributor_customer_path(id: object.id)
    ApplicationController.helpers.customer_badge(object, link: link)
  end

  def account_balance
    object.account_balance(reload: false)
  end

  def account_balance_with_currency
    account_balance.with_currency(object.account.currency)
  end

  def negative_balance?
    account_balance.negative?
  end

  def self.all_dynamic_tags
    {
      'halted'           => 'important',
      'negative-balance' => 'hidden'
    }.freeze
  end

  def self.all_dynamic_tags_as_a_list
    all_dynamic_tags.keys.freeze
  end

  def dynamic_tags
    self.class.all_dynamic_tags.select do |tag|
      public_send(tag.questionize)
    end
  end

  def next_delivery_summary
    date = object.next_order_occurrence_date
    return "(no upcoming deliveries)" unless date

    next_orders = object.calculate_next_orders(date).select do |order|
      order.next_occurrence == date
    end.map(&:decorate)

    [
      date.strftime("%A, %d %b %Y"),
      next_orders.map(&:summary).sort
    ].join("\n")
  end

  def active_orders_count
    object.orders.active.count
  end

  def minimum_balance
    object.balance_threshold
  end

  def balance_threshold
    object.balance_threshold.format
  end

  def delivery_note
    object.special_order_preference
  end

  def next_delivery_date
    date = object.next_order_occurrence_date
    if date
      date.to_date.iso8601
    else
      ""
    end
  end

  def customer_creation_date
    object.created_at.to_date.iso8601
  end

  def last_paid_date
    time = object.last_paid
    if time.present?
      time.to_date.iso8601
    else
      nil
    end
  end

  def customer_packing_notes
    object.special_order_preference
  end

  def customer_number
    object.formated_number
  end

  def customer_creation_method
    if object.via_webstore?
      "Webstore"
    else
      "Manual"
    end
  end

  def customer_note
    object.notes
  end

  def customer_labels
    object.tag_list.join(', ')
  end

  def next_delivery
    order = object.next_order
    order.present? ? order.box.name : nil
  end

  def address_line_1
    address_1
  end

  def address_line_2
    address_2
  end
end

