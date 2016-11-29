"use strict";
const helper = require('../utils/helper');
const constants = require('../utils/constants');

module.exports = function(data) {
    return {
        getHome(req, res) {
            res.render('home', helper.isAuthenticated(req))
        },
        getLogin(req, res) {
            res.render('login', helper.isAuthenticated(req));
        },
        getProfile(req, res) {
            if (!req.isAuthenticated()) {
                res.status(401).redirect('/unauthorized', constants.notLoggedIn);
            } else {
                const user = req.user;
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