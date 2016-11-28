/* globals require module */

const constants = require("./utils/constants");
const app = require("./config/app");
const data = require('./data')(constants);
require('./routers')(app,data);
//
// // For testing purpose!!
// data.createAuction("Prodaam bulka",'bulka',['az','david','drugiq kircho','milen','merhat']);
// data.createAuction("Prodaam bulka",'bulka',['az','david','drugiq kircho','milen','merhat']);
// data.createAuction("Prodaam bulka",'bulka',['az','david','drugiq kircho','milen','merhat']);
// data.createAuction("Prodaam bulka",'bulka',['az','david','drugiq kircho','milen','merhat']);
// data.createAuction("Prodaam bulka",'bulka',['az','david','drugiq kircho','milen','merhat']);

app.listen(constants.port, () =>
    console.log(`Server is running on http://localhost:${constants.port}`));