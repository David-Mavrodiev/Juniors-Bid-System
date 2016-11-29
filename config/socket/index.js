const chatController = require('../../controllers/chat-controller');

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

        onlineUsers.push(socket);

        console.log('Connected: ' + onlineUsers.length + ' users connected');

        socket.on('person-connected', function(data) {
            socket.emit('draw-chat', { msg: 'draw chat' });
        });

        socket.on('disconnect', function(data) {
            onlineUsers.splice(onlineUsers.indexOf(socket), 1);
            console.log('Disconected: ' + onlineUsers.length + ' users connected');
        });
    });
}