"use strict";
const loggedIn = {
    result: {
        isAuthenticated: true
    }
},
    notLoggedIn = {
        result: {
            isAuthenticated: false
        }
    };

module.exports = function(data) {
    return {
        getHome(req, res) {
            let loginInfo;
            if (req.isAuthenticated()) {
                loginInfo = loggedIn;
            } else {
                loginInfo = notLoggedIn;
            }
            res.render('home', loginInfo)
        },
        getLogin(req, res) {
            let loginInfo;
            if (req.isAuthenticated()) {
                loginInfo = loggedIn;
            } else {
                loginInfo = notLoggedIn;
            }
            res.render('login', loginInfo);
        },
        getProfile(req, res) {
            if (!req.isAuthenticated()) {
                res.status(401).redirect('/unauthorized', notLoggedIn);
            } else {
                const user = req.user;
                console.log(user.image);
                res.render("profile", {
                    result: {
                        username: user.username,
                        image: user.image,
                        isAuthenticated: loggedIn.result.isAuthenticated
                    }
                });
            }
        },
        getUnauthorized(req, res) {
            res.render("unauthorized", notLoggedIn);
        },
        getRegister(req, res) {
            res.render("register", notLoggedIn);
        }
    };
};