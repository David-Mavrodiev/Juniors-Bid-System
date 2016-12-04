/*globals $*/
'use strict';

$('#comment-send').on('click', function() {
    var comment = $('#comment-text').val();
    var url = document.URL.split('/');
    var id = url[url.length - 1];
    if (comment === null ||
        comment === undefined ||
        comment === '') {
        console.log('Empty Comment')
    } else {
        $.ajax({
            url: `/auctions/${id}`,
            type: 'POST',
            data: { text: comment },
            success: function() {
                location.reload();
                //$('.comments').append(createComment(text, user))
            }
        })
    }
});

var createComment = function(text, user) {
    return `<div class='comment'>
                <p class="comment-value">${text}</p>
                <p class="comment-user">${user}</p>
            </div>`
};