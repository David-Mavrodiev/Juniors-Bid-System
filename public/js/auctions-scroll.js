/*globals $*/
var currentPage;

window.onpageshow = function (event) {
    currentPage = 1;
};


$('#load-more').on('click', function () {
    $.ajax({
        url: `/auctions/page/${currentPage}`,
        type: "get",
        dataType: "html",
        success: function (html) {
            if (html !== '') {
                $('.auctions').append(html);
                currentPage++;
            } else {
                $('#load-more')
                    .val('no more pages to show')
                    .css('background-color', 'white')
                    .css('color', 'black')
                    .css('border', 'none')
            }

        }
    });
});