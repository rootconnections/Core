module OrdersHelper
  def order_customisation(order)
    description = order.customisation_description
    content_tag(:span, truncate(description), title: description)
  end

  def order_extras(order)
    description = order.extras_description(true)
    content_tag(:span, truncate(description), title: description)
  end

  def order_frequencies
    ScheduleRule::RECUR.map { |frequencies| [frequencies.to_s.titleize, frequencies.to_s] }
  end

  def order_schedule(order)
    if order.recurs?
      order.schedule_rule.deliver_on
    elsif order.next_occurrence
      "#{t('deliver_on')} #{l order.next_occurrence, format: "%A"}"
    else
      t('models.schedule_rule.no_future_deliveries')
    end
  end

  # Show the orders next delivery dates, link to the delivery screen if it is within the forcast range
  def orders_next_deliveries(order, options = {})
    options = { with_link: true }.merge(options)

    order_occurrences = order.next_occurrences(5, Date.current).map do |day|
      formatted_day = l day, format: "%d %b"

      if options[:with_link] && day <= Order::FORCAST_RANGE_FORWARD.from_now.to_date
        link_to(formatted_day, date_distributor_deliveries_path(day, order.delivery_service))
      else
        formatted_day
      end
    end

    order_occurrences.join(', ').html_safe unless order_occurrences.empty?
  end

  def order_pause_date_formatted(order)
    date = order.pause_date
    date ? l(date, format: "%a %-d %b") : ''
  end

  def order_resume_date_formatted(order)
    date = order.resume_date
    date ? l(date, format: "%a %-d %b") : ''
  end

  def order_delete_warning(order)
    no_deliveries_confirm = "Are you sure you would like to deactivate this order? It will no longer generate deliveries."
    deliveries_confirm = "WARNING\r\rSorry some deliveries generated by this order could not be deleted as they are already for packing and delivery."

    order.has_yellow_deliveries? ? deliveries_confirm : no_deliveries_confirm
  end
end
