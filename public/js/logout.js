/*globals $*/
(function () {
    $('#logout-button').on('click', (e) => {
        e.preventDefault();
        $.post('/logout', (data) => {
            window.location.href = data.redirectUrl;
        });
    });
}());