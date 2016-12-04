/*globals  $ moment*/
$('.auction').each(function () {
    var str = $(this).find('.time').text();
    var parsed = moment(str);
    var formatted = parsed.format('lll');
    if (formatted !== 'Invalid date') {
        $(this).find('.time').text('Ends at: ' + formatted);
    }else{
        $(this).find('.time').text('Invalid date');
    }
});