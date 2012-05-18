#FIXME: Too much code in this controller!

require 'csv'

class Distributor::DeliveriesController < Distributor::ResourceController
  custom_actions collection: [:update_status, :master_packing_sheet, :export]

  respond_to :html, :xml, except: [:update_status, :export]
  respond_to :json, except: [:master_packing_sheet, :export]
  respond_to :csv, only: :export

  NAV_START_DATE = Date.current - 2.week
  NAV_END_DATE   = Date.current + 2.week

  def index
    @routes = current_distributor.routes

    if @routes.empty?
      redirect_to distributor_settings_routes_url, alert: 'You must create a route before you can view the deliveries page.' and return
    end

    unless params[:date] && params[:view]
      redirect_to date_distributor_deliveries_url(Date.current, 'packing') and return
    end

    index! do
      @selected_date = Date.parse(params[:date])
      @route_id = params[:view].to_i

      @delivery_lists = DeliveryList.collect_lists(current_distributor, NAV_START_DATE, NAV_END_DATE)
      @delivery_list  = @delivery_lists.find { |delivery_list| delivery_list.date == @selected_date }
      @all_deliveries = @delivery_list.deliveries

      @packing_lists = PackingList.collect_lists(current_distributor, NAV_START_DATE, NAV_END_DATE)
      @packing_list  = @packing_lists.find  { |packing_list| packing_list.date == @selected_date }
      @all_packages  = @packing_list.packages

      if @route_id != 0
        @items     = @all_deliveries.select{ |delivery| delivery.route.id == @route_id }
        @real_list = @items.all? { |i| i.is_a?(Delivery) }
        @route     = @routes.find(@route_id)
      else
        @items     = @all_packages
        @real_list = @items.all? { |i| i.is_a?(Package) }
        @route     = @routes.first
      end
    end
  end

  def update_status
    deliveries = current_distributor.deliveries.where(id: params[:deliveries])
    status = params[:status]

    options = {}
    options[:date] = params[:date] if params[:date]

    if Delivery.change_statuses(deliveries, status, options)
      head :ok
    else
      head :bad_request
    end
  end

  def export
    redirect_to :back and return unless params[:deliveries] || params[:packages]

    export_type = (params[:deliveries] ? :delivery : :packing)

    if export_type == :delivery
      export_items = current_distributor.deliveries.where(id: params[:deliveries])
      export_items = export_items.sort_by { |ei| ei.position }
      csv_headers = Delivery.csv_headers
    else
      packages = current_distributor.packages.where(id: params[:packages])

      export_items = []

      packages.group_by(&:box).each do |box, array|
        array.each do |package|
          export_items << package
        end
      end

      csv_headers = Package.csv_headers
    end

    csv_output = CSV.generate do |csv|
      csv << csv_headers
      export_items.each { |package| csv << package.to_csv }
    end

    if export_items
      filename = "bucky-box-#{export_type}-export-#{Date.current.to_s}.csv"
      type     = 'text/csv; charset=utf-8; header=present'

      send_data(csv_output, type: type, filename: filename)
    else
      respond_to :back
    end
  end

  def master_packing_sheet
    redirect_to :back and return unless params[:packages]

    @packages = current_distributor.packages.find(params[:packages])

    @packages.each do |package|
      package.status = 'packed'
      package.packing_method = 'manual'
      package.save
    end

    render layout: 'print'
  end

  def reposition
    delivery_list = current_distributor.delivery_lists.find_by_date(params[:date])

    if delivery_list.reposition(params[:delivery])
      head :ok
    else
      head :bad_request
    end
  end

  def paid
    binding.pry

    head :ok
  end
end
