$('#offer-button').on('click', function () {
    if ($('.min-price-and-time').css('display') !== 'none') {

        $('.min-price-and-time').css('display', 'none');
        $('#offer-container').css('display', 'block');

    }else {
        $('.min-price-and-time').css('display', 'block');
        $('#offer-container').css('display', 'none');
    }
});