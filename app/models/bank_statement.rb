require 'csv'

class BankStatement < ActiveRecord::Base
  belongs_to :distributor

  has_many :payments

  mount_uploader :statement_file, BankStatementUploader

  attr_accessible :distributor, :statement_file

  def process_statement!(customers_ids)
    it=0

    CSV.foreach(statement_file.path, :headers => :first_row) do |row|
      if row['Amount'].to_i > 0
        create_payment!(row, customers_ids[it.to_s]) unless customers_ids[it.to_s].blank?
        it += 1
      end
    end
  end

  def customer_remembers
    remembers = {}
    it = 0

    CSV.foreach(statement_file.path, :headers => :first_row) do |row|
      if row['Amount'].to_i > 0
        r = row['Reference']
        remembers["#{it}"] = r ? customer_for_reference(r) : nil
        it += 1
      end
    end

    return remembers
  end

  private

  def create_payment!(row, customer_id)
    account = Customer.find(customer_id).account

    payments.create!(
      distributor: distributor,
      account: account,
      bank_statement: self,
      kind: 'bank_transfer',
      description: 'Payment generated by CSV import',
      amount: row['Amount'],
      reference: row['Reference']
    )

    remove_statement_file!
  end

  def customer_for_reference(reference)
    payment = distributor.payments.where(reference:reference).last
    return payment ? payment.customer.id : nil
  end
end
