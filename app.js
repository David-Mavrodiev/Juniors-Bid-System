/* globals require module */

const constants = require("./utils/constants");
const app = require("./config/app");

app.listen(constants.port, () => console.log(`Server is running on http://localhost:${constants.port}`));