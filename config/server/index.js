module.exports = function(app, constants) {
    const server = require('http').createServer(app);

    return server;
}