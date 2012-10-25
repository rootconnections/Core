$(function() {
  $('#more-transactions a').click(function() {
    $(this).hide();
    $('#more-transactions #ajax-loader').show();

    var account_id = $('#transactions').data('account');
    var offset = $('#transactions .transaction-data').length;

    $.ajax({
      type: 'GET',
      dataType: 'html',
      url: '/distributor/accounts/' + account_id + '/more_transactions/' + offset,
      success: function(data) {
        var transaction_table = $('#transactions');
        var more_link = transaction_table.find('tr:last');

        transaction_table.append(data);

        more_link.appendTo(transaction_table);
        $('#more-transactions #ajax-loader').hide();
        $('#more-transactions a').show();
        more_link.show();
      }
    });

    return false;
  });

  var order_pause_init = function(){
    $('.initial-link a').click(function() {
      fromPausingElementFind(this, '.initial-link').hide();
      fromPausingElementFind(this, '.form-selection').show();
      return false;
    });

    $('.cancel-link a').click(function() {
      fromPausingElementFind(this, '.form-selection').hide();

      var resulting_link = fromPausingElementFind(this, '.resulting-link');

      if(resulting_link.data('date')) {
        resulting_link.show();
      }
      else {
        fromPausingElementFind(this, '.initial-link').show();
      }

      return false;
    });

    $('.remove-link a').click(function() {
      fromPausingElementFind(this, '.form-selection').hide();
      fromPausingElementFind(this, '.remove-link').hide();
      fromPausingElementFind(this, '.initial-link').show();
      return false;
    });

  $('.pause .remove-link a').click(function() {
    var resume = $(this).closest('.pausing').find('.resume');
    resume.hide();
    resume.find('.initial-link').show();
    resume.find('.form-selection').hide();
    resume.find('.remove-link').hide();
    resume.find('.resulting-link').hide();

    var url = $(this).attr('href');
    $.ajax({ type: 'POST',
             dataType: 'html',
             url: url,
             success: reload_pause_details});
    return false;
  });

  $('.resume .remove-link a').click(function() {
    var url = $(this).attr('href');
    $.ajax({ type: 'POST',
             dataType: 'html',
             url: url,
             success: reload_pause_details});
    return false;
  });

    $('.pause .form-selection :submit').click(function() {
      var form = fromPausingElementFind(this, '.form-selection form');
      var url  = form.attr('action');
      var date = form.find('select :selected').val();

      $(this).attr('disabled', true);

      $.ajax({
        type: 'PUT',
        dataType: 'html',
        url: url,
        data: $.param({ date: date }),
        success: reload_pause_details});

      return false;
    });

    $('.resume .form-selection :submit').click(function() {
      var form = fromPausingElementFind(this, '.form-selection form');
      var url  = form.attr('action');
      var date = form.find('select :selected').val();

      $(this).attr('disabled', true);

      $.ajax({
        type: 'PUT',
        dataType: 'html',
        url: url,
        data: $.param({ date: date }),
        success: reload_pause_details });

      return false;
    });

    $('.resulting-link a').click(function() {
      fromPausingElementFind(this, '.resulting-link').hide();
      fromPausingElementFind(this, '.form-selection').show();
      fromPausingElementFind(this, '.remove-link').show();
      return false;
    });
  }
  order_pause_init();
  
  function reload_pause_details(data) {
    $("#order_details").html(data);
    order_pause_init();
  }
});

function fromPausingElementFind(startElement, findName) {
  return $(startElement).closest('.info-controller').find(findName);
}
