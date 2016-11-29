"use strict"

module.exports = (app, data) => {
    const passport = require("passport");

    passport.serializeUser((user, done) => {
        if (user) {
            done(null, user.username);
        }
    });

    passport.deserializeUser((username, done) => {
        data.findUserByUsername(username)
            .then((user) => {
                done(null, user || false)
            });
    });

    require("./local-strategy")(passport, data);

    app.use(passport.initialize());
    app.use(passport.session());
};