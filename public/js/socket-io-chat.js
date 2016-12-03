$(function() {
    let localUserData = null;

    let pathName = window.location.pathname;

    let socket = io.connect();

    if (pathName == '/profile') {
        let username = $('.username').html();

        socket.emit('crypt-name', username);

        socket.on('crypted-name', function(name) {
            localStorage.setItem('token', name);
        });

        setSocketRoutes(username);
    } else {
        let usernameCrypted = localStorage.getItem('token');

        socket.emit('decrypt-name', usernameCrypted);

        socket.on('decrypted-name', function(username) {
            setSocketRoutes(username);
        });
    }

    function setSocketRoutes(username) {
        socket.emit('person-connected', username);

        socket.on('wrong-token', function(token) {
            $.post('/logout', function() {

            });
        });

        socket.on('draw-chat', function(chatData) {
            localUserData = chatData.localUser;

            drawOnlineUsers(chatData.allUsersData, chatData.localUser, chatData.chats);
        });

        messageController.sendMessage = function(toUser, message) {
            socket.emit('send-message', { toUser, message });
        }

        socket.on('message-recive', function(message) {
            for (let i = 0; i < messageCollectionData.length; i += 1) {
                if (messageCollectionData[i].toUsername == message.toUsername) {
                    messageCollectionData[i].messages = message.messages;
                    drawMessageBox(messageCollectionData[i], localUserData);
                    return;
                }
            }

            messageCollectionData.push(message);
            drawMessageBox(message, localUserData);
        });

        socket.on('person-online', (userData) => {
            for (let i = 0; i < usersOnline.length; i += 1) {
                if (usersOnline[i].username == userData.username) {
                    usersOnline[i].online = true;
                    break;
                }
            }

            for (let i = 0; i < messageCollectionData.length; i += 1) {
                if (messageCollectionData[i].toUsername == userData.username) {
                    messageCollectionData[i].online = true;
                    break;
                }
            }

            drawOnlineUsers(usersOnline, localUserData, messageCollectionData);
        })
    }
})