"use strict";
const helper = require('../utils/helper');
const constants = require('../utils/constants');
const multer = require('multer');
const upload = multer().single('userPhoto');
const fs = require('fs');

module.exports = function (data) {
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
                fs.writeFileSync('./public/img/profile-image.jpg', new Buffer(req.user.image));

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
        },
        uploadImage(req, res) {
            upload(req, res, function (err) {
                if (err) {
                    return res.end(JSON.stringify(err));
                }

                data.updateUserImage(req.user.username, req.file.buffer);
                res.redirect('profile');
            });
        }
    };
};