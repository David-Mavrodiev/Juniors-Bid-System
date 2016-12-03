$('.navbar-nav').on('click', function () {
    if ($('.open-info').css('visibility') === 'visible') {
        $('.open-info').css('visibility', 'hidden');
        $('.open-info').css('opacity', '0');
    } else {
        $('.open-info').css('visibility', 'visible');
        $('.open-info').css('opacity', '1');
    }
});
