console.log("TEST");
$(".btn-success").on("click", function(event) {
    let username = $(event.target).text().split(' ')[1];
    console.log(username);

    let body = {
        username: username
    };

    $.ajax({
        url: "/createAdmin",
        type: "POST",
        cors: true,
        contentType: "application/json",
        data: JSON.stringify(body),
        success: function(response) {
            location.href = "/home";
        }
    });
});