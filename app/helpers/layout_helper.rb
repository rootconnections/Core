module LayoutHelper
  def title(page_title, show_title = true)
    content_for(:title) { h(page_title.to_s) }
    @show_title = show_title
  end

  def show_title?
    @show_title
  end

  def stylesheet(*args)
    content_for(:head) { stylesheet_link_tag(*args) }
  end

  def javascript(*args)
    content_for(:head) { javascript_include_tag(*args) }
  end

  FLASH_CLASSES = {
    notice:  'alert-success',
    warning: 'info-warning',
    error:   'alert-error',
    alert:   'alert-error'
  }

  def flash_bar(message, options = {})
    classes = 'alert'
    classes += " #{FLASH_CLASSES[options[:kind]]}" if options[:kind]

    message = button_tag('&times;'.html_safe, type: 'button', class: 'close', data: { dismiss: 'alert' }) + message

    content_tag(:div, message.html_safe, class: classes)
  end

  def checkmark_boolean(value)
    (value ? '&#x2714' : '&#10007').html_safe
  end

  def customer_title(customer, options = {})
    html_tag = options.delete(:html_tag) || :h1

    html_options = { class: '', id: '' }
    html_options[:class] += 'text-center' if options.delete(:center)
    html_options[:class] += options.delete(:class).to_s
    html_options[:id] = options.delete(:id) if options[:id]

    title_text = options.delete(:title) || customer_and_number(customer)
    title(title_text, false)

    return content_tag(html_tag, customer_badge(customer, options), html_options)
  end

  def customer_and_number(customer)
    "##{customer.id} #{customer.name}"
  end

  def customer_badge(customer, options = {})
    customer_id = customer.formated_number.to_s

    if options[:link] == false
      content = content_tag(:span, customer_id, class: 'customer-id')
    elsif options.has_key?(:link)
      content = link_to(customer_id, url_for(options[:link]), class: 'customer-id')
    else
      content = link_to(customer_id, [:distributor, customer], class: 'customer-id')
    end

    customer_name = options[:customer_name] || customer.name
    customer_name = truncate(customer_name, length: 18) if options[:short]
    content += content_tag(:span, customer_name, class: 'customer-name')

    badge = content_tag(:span, content.html_safe, class: 'customer-badge')

    return [ options[:before], badge, options[:after] ].join.html_safe
  end
end
