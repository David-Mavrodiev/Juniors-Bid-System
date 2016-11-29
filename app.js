/* globals require module */

const constants = require("./utils/constants");
const app = require("./config/app");
const server = require('./config/server')(app, constants)
const data = require('./data')(constants);
const socketIo = require('./config/socket')(server, data);

console.log('routers');

require('./config/passport')(app, data);

require('./routers')(app, data);
//
// For testing purpose!!
// data.createAuction("Prodaam bulka",'bulka',['az','david','drugiq kircho','milen','merhat']);
// data.createAuction("Prodaam bulka",'bulka',['az','david','drugiq kircho','milen','merhat']);
// data.createAuction("Prodaam bulka",'bulka',['az','david','drugiq kircho','milen','merhat']);
// data.createAuction("Prodaam bulka",'bulka',['az','david','drugiq kircho','milen','merhat']);
// data.createAuction("Prodaam bulka",'bulka',['az','david','drugiq kircho','milen','merhat']);

server.listen(process.env.PORT || constants.port, () =>
    console.log(`Server is running on http://localhost:${constants.port}`));