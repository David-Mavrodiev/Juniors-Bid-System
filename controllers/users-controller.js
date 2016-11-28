"use strict";
const constants = require('../utils/constants');

module.exports = function(data) {
    return {
        getHome(req, res) {
            let loginInfo;
            if (req.isAuthenticated()) {
                loginInfo = constants.loggedIn;
            } else {
                loginInfo = constants.notLoggedIn;
            }
            res.render('home', loginInfo)
        },
        getLogin(req, res) {
            let loginInfo;
            if (req.isAuthenticated()) {
                loginInfo = constants.loggedIn;
            } else {
                loginInfo = constants.notLoggedIn;
            }
            res.render('login', loginInfo);
        },
        getProfile(req, res) {
            if (!req.isAuthenticated()) {
                res.status(401).redirect('/unauthorized', constants.notLoggedIn);
            } else {
                const user = req.user;
                console.log(user.image);
                res.render("profile", {
                    result: {
                        username: user.username,
                        image: user.image,
                        isAuthenticated: constants.loggedIn.result.isAuthenticated
                    }
                });
            }
        },
        getUnauthorized(req, res) {
            res.render("unauthorized", constants.notLoggedIn);
        },
        getRegister(req, res) {
            res.render("register", constants.notLoggedIn);
        }
    };
};