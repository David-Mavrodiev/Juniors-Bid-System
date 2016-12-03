/*globals */
"use strict"

const LocalStrategy = require("passport-local");
const constants = require('../../utils/constants');
const encryptor = require('simple-encryptor')(constants.cryptingKey);

module.exports = function(passport, data) {
    const authStrategy = new LocalStrategy(
        function(username, password, done) {
            data.findUserByUsername(username)
                .then(user => {
                    if (!user) {
                        done(null, false);
                        return;
                    }

                    const decryptedPassword = encryptor.decrypt(user.password);

                    if (user && (decryptedPassword === password)) {
                        done(null, user);
                    } else {
                        done(null, false);
                    }
                })
                .catch(error => done(error, false));
        }
    );
    passport.use(authStrategy);
}