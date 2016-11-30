$(function() {
    let pathName = window.location.pathname;

    let socket = io.connect();

    /*

    if (pathName == '/profile') {
        let username = $('.username').html();

        socket.emit('crypt-name', username);

        socket.on('crypted-name', function(name) {
            localStorage.setItem('username', name);
        });

        setSocketRoutes(username);
    } else {
        let usernameCrypted = localStorage.getItem('username');

        socket.emit('decrypt-name', usernameCrypted);

        socket.on('decrypted-name', function(username) {
            console.log('decrypted: ' + username + ' crypted: ' + usernameCrypted);
            setSocketRoutes(username);
        })
    }

    function setSocketRoutes(username) {
        socket.emit('person-connected', {
            username: username
        });

        socket.on('draw-chat', function(chatData) {
            drawOnlineUsers(chatData.users, chatData.messageCollectionData, chatData.localUserData);
        });
    }
    */
})