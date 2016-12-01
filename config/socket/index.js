const chatController = require('../../controllers/chat-controller');
const constants = require('../../utils/constants');
const encryptor = require('simple-encryptor')(constants.cryptingKey);

module.exports = function(server, data) {
    let io = require('socket.io').listen(server);

    //User model
    //{
    //    username: 'Amer',
    //    imgUrl: 'https://img.ifcdn.com/images/191c7b9bd5340655f3dac23815fade532a24fb7e8ed6f82d23e59309f85c73d8_1.jpg',
    //    online: true
    //}
    let onlineUsers = [];

    io.on('connection', function(socket) {
        //data.getAllUsers().then(users => {
        //    onlineUsers = users;
        //}).catch(console.log);

        let userNow = null;

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

                //TODO Handle
                if (!userNow) {
                    throw 'User with this name not found';
                } else {
                    onlineUsers.push(userNow);
                }

                console.log('Connected: ' + onlineUsers.length + ' users connected');

                chatInfo.localUser = userNow;
                chatInfo.allUsersData = allUsersData;

                socket.emit('draw-chat', chatInfo);
            });
        });

        socket.on('disconnect', function(data) {
            if (userNow) {
                onlineUsers.splice(onlineUsers.indexOf(userNow), 1);
                console.log('Disconected: ' + onlineUsers.length + ' users connected');
            }
        });

    });
}