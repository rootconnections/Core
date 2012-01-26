module Distributor::DeliveriesHelper
  CALENDAR_DATE_SIZE = 59

  def calendar_nav_length(delivery_lists)
    number_of_month_dividers = delivery_lists.group_by{|dl| dl.date.month}.size
    nav_length = delivery_lists.size + number_of_month_dividers

    return "width:#{nav_length * CALENDAR_DATE_SIZE}px;"
  end

  def date_class(date_list)
    'today' if date_list.date.today?
  end

  def count_selected(date_list, date)
    'selected' if date_list.date.to_s == date
  end

  def count_class(date_list, date)
    'has_pending' unless date_list.all_finished
  end

  def reschedule_dates(route)
    dates = route.schedule.next_occurrences(5, Time.now)
    options_from_collection_for_select(dates, 'to_date', 'to_date')
  end

  def order_delivery_route_name(order, date)
    delivery = order.delivery_for_date(date)
    delivery.route.name if delivery
  end

  def order_delivery_count(calendar_array, date, route = nil)
    data = calendar_array.select{|cdate, cdata| cdate == date}[0][1]

    if route
      orders = Order.find(data[:order_ids]).select{|o| o.route(date) == route}.size
    else
      data[:order_ids].size
    end
  end
end
