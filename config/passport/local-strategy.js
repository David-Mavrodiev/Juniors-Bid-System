/*globals */
"use strict"

const LocalStrategy = require("passport-local");

module.exports = function(passport, data) {
    const authStrategy = new LocalStrategy(
        function(username, password, done) {
            data.findUserByUsername(username)
                .then(user => {
                    if (user && (user.password === password)) {
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