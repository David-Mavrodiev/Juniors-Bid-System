/*globals require module*/

const constants = require("../utils/constants");
const mongoose = require("mongoose");

mongoose.connect(constants.usersConnectionString);

const db = mongoose.connection;

db.on("error", (err) => {
    console.log("Error with connection: " + err);
});

db.on("open", () => {
    console.log("Successfully connected to database");
});

module.exports = (User) => {
    return {
        findUserByUsername: function (name) {
            let query = User.findOne()
                .where({
                    username: new RegExp(name)
                });

            return Promise.resolve(query.exec());
        },
        createUser: function (obj) {
            //console.log(`Username: ${username}, Password: ${password}`);
            let user = new User({
                username: obj.username,
                password: obj.password,
                image: obj.image
            });
            return Promise.resolve(user.save());
        }
    };
};