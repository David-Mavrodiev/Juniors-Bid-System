///TODO: Add categories search
window.onpageshow = function(event) {
    var currentPage = 1;

    $('#load-more').on('click',function () {
        window.location.replace(`/auctions/page/${currentPage}`);
        currentPage++;
    });

};





// var $grid = $('.grid').isotope({
//     itemSelector: '.element-item',
//     layoutMode: 'vertical'
// });
// $(function () {
//     $('.auctions').infinitescroll({
//         navSelector: "a#load-more",
//         // selector for the paged navigation (it will be hidden)
//         nextSelector: "a#load-more",
//         // selector for the NEXT link (to page 2)
//         itemSelector: ".auction"
//         // selector for all items you'll retrieve
//     });
//
//     $(window).unbind('.infscr');
//
// // hook up the manual click guy.
//     $('a#load-more').click(function () {
//         $(document).trigger('retrieve.infscr');
//         return false;
//     });
//     // remove the paginator when we're done.
//     $(document).ajaxError(function (e, xhr, opt) {
//         if (xhr.status == 404) $('a#load-more').remove();
//     });
//     $('').load('/page/2/ #content div.post', function () {
//         $(this).appendTo('.auctions');    // once they're loaded, append them to our content area
//     });
// });