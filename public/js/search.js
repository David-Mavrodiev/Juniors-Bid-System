/*globals $*/
"use strict";

//OnPage Search
$('#pref-search').on('input', function () {
    var str = $('#pref-search').val();
    $('.auction').each(function () {
        if ($(this).find('h1').text().indexOf(str) !== -1) {
            $(this).css('display', 'inline-block');
        } else {
            $(this).css('display', 'none');
        }
    })
});

//DeepSearch
$('#button-send-search').on('click', function () {
    var str = $('#pref-search').val();
    //TODO: Perform case insensitive search
    window.location.replace(`/auctions/search/${str}`);
    // console.log(str);
    // $.ajax({
    //     type: 'get',
    //     url: `/auctions/search/${str}`,
    //     data: 'html',
    //     dataType: 'html',
    //     success: function (html) {
    //         console.log(html);
    //         $(document).html(html);
    //     }
    // })
});