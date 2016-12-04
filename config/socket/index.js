const constants = require('../../utils/constants');
const encryptor = require('simple-encryptor')(constants.cryptingKey);

module.exports = function(server, data) {
    let io = require('socket.io').listen(server);
    let onlineUsers = [];
    let sockets = [];

    io.on('connection', function(socket) {
        let userNow = null;

        let socketId = null;

        socket.on('crypt-name', function(name) {
            let cryptedName = encryptor.encrypt(name);

            socket.emit('crypted-name', cryptedName);
        })

        socket.on('decrypt-name', function(cryptedName) {
            let decryptedName = encryptor.decrypt(cryptedName);

            socket.emit('decrypted-name', decryptedName);
        })

        socket.on('person-connected', function(username) {
            let chatInfo = {

            };

            data.getAllUsers().then(allUsers => {
                let allUsersData = [];

                for (let i = 0; i < allUsers.length; i += 1) {
                    if (allUsers[i].username == username) {
                        userNow = {
                            username,
                            imgUrl: '/static/profileimages/' + username + '.jpg',
                            online: true
                        }
                    } else {
                        allUsersData.push({
                            username: allUsers[i].username,
                            imgUrl: '/static/profileimages/' + allUsers[i].username + '.jpg',
                            online: onlineUsers.filter((user) => {
                                return user.username == allUsers[i].username;
                            }).length > 0
                        });
                    }
                }
                if (!userNow) {
                    socket.emit('wrong-token', {});
                    return;
                } else {
                    socket.broadcast.emit('person-online', { username });
                    sockets.push(socket);
                    socketId = sockets.length - 1;
                    onlineUsers.push(userNow);

                    socket.on('send-message', function(messageData) {

                        data.addMessageToChat(userNow.username, messageData.toUser, userNow.username, messageData.message)
                            .then(message => {
                                let messageToSendToSender = {
                                    toUsername: messageData.toUser,
                                    toImgUrl: '/static/profileimages/' + messageData.toUser + '.jpg',
                                    messages: message.messages,
                                    online: onlineUsers.filter((user) => {
                                        return user.username == messageData.toUser;
                                    }).length > 0
                                }
                                socket.emit('message-recive', messageToSendToSender);

                                for (let i = 0; i < onlineUsers.length; i += 1) {
                                    if (onlineUsers[i].username == messageData.toUser) {
                                        let messageToSendToReciver = {
                                            toUsername: userNow.username,
                                            toImgUrl: '/static/profileimages/' + userNow.username + '.jpg',
                                            messages: message.messages,
                                            online: true
                                        }

                                        sockets[i].emit('message-recive', messageToSendToReciver);
                                        break;
                                    }
                                }
                            });
                    })
                }

                console.log('Connected: ' + onlineUsers.length + ' users connected');

                chatInfo.localUser = userNow;
                chatInfo.allUsersData = allUsersData;
                chatInfo.chats = [];

                data.findChatsByUsername(userNow.username)
                    .then(chats => {
                        for (let i = 0; i < chats.length; i += 1) {
                            if (chats[i].firstUser == userNow.username) {
                                chatInfo.chats.push({
                                    toUsername: chats[i].secondUser,
                                    toImgUrl: '/static/profileimages/' + chats[i].secondUser + '.jpg',
                                    messages: chats[i].messages,
                                    online: onlineUsers.filter((user) => {
                                        return user.username == chats[i].secondUser;
                                    }).length > 0
                                })
                            } else if (chats[i].secondUser == userNow.username) {
                                chatInfo.chats.push({
                                    toUsername: chats[i].firstUser,
                                    toImgUrl: '/static/profileimages/' + chats[i].firstUser + '.jpg',
                                    messages: chats[i].messages,
                                    online: onlineUsers.filter((user) => {
                                        return user.username == chats[i].firstUser;
                                    }).length > 0
                                })
                            } else {
                                throw 'Messages with user ' + userNow.username + ' Not found.';
                            }
                        }

                        socket.emit('draw-chat', chatInfo);
                    });
            });
        });

        socket.on('disconnect', function(data) {
            if (userNow) {
                for (let i = 0; i < onlineUsers.length; i += 1) {
                    if (userNow.username == onlineUsers[i].username) {
                        onlineUsers.splice(i, 1);
                    }
                }

                sockets.splice(socketId, 1);
                console.log('Disconected: ' + onlineUsers.length + ' users connected');
            }
        });

    });
}