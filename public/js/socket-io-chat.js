$(function() {
    let socket = io.connect();

    socket.on('draw-chat', function(data) {
        //drawOnlineUsers(data.usersOnline, data.messageCollectionData, data.localUserData);
    });
})