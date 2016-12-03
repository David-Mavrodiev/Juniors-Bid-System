"use strict";
const helper = require('../utils/helper');
const constants = require('../utils/constants');
const multer = require('multer');
const upload = multer().single('userPhoto');
const fs = require('fs');

function usersController(data) {
    return {
        getHome(req, res, errorMessage) {
            const user = req.user;
            let isAuthenticated = helper.isAuthenticated(req);
            let imageUrl;

            if (user) {
                imageUrl = '/static/profileimages/' + user.username + '.jpg';
            }

            res.render('home', {
                result: {
                    isAuthenticated: req.isAuthenticated(),
                    img: imageUrl
                },
                error: helper.getErrorMessage(errorMessage)
            })
        },
        getLogin(req, res, errorMessage) {
            if (req.isAuthenticated()) {
                usersController(data).getProfile(req, res, 'You are logged in!');
            }

            let result = helper.isAuthenticated(req)

            result.error = helper.getErrorMessage(errorMessage);

            res.render('login', result);
        },
        getProfile(req, res, errorMessage) {
            if (!req.isAuthenticated()) {
                usersController(data).getLogin(req, res, 'You must log in to see your profile.');
            } else {
                const user = req.user;
                let isAuthenticated = helper.isAuthenticated(req);
                let imageUrl;

                if (user) {
                    imageUrl = '/static/profileimages/' + user.username + '.jpg';
                }
                res.render("profile", {
                    result: {
                        username: user.username,
                        image: user.image,
                        img: imageUrl,
                        isAuthenticated: req.isAuthenticated()
                    },
                    error: helper.getErrorMessage(errorMessage)
                });
            }
        },
        getUnauthorized(req, res) {
            res.render("unauthorized", constants.notLoggedIn);
        },
        getRegister(req, res, errorMessage) {
            if (req.isAuthenticated()) {
                usersController(data).getProfile(req, res, 'You are logged in!');
            }

            let result = constants.notLoggedIn;
            result.error = helper.getErrorMessage(errorMessage);
            res.render("register", constants.notLoggedIn);
        },
        uploadImage(req, res) {
            upload(req, res, function(err) {
                if (err) {
                    return res.end(JSON.stringify(err));
                } else if (!req.file) {
                    usersController(data).getProfile(req, res, 'You must select an image file!');
                } else {
                    data.updateUserImage(req.user.username, req.file.buffer)
                        .then((user) => {
                            fs.writeFileSync('./public/profileimages/' + user.username + '.jpg', new Buffer(req.file.buffer));
                            res.redirect('/profile');
                        });
                }
            });
        }
    };
};

module.exports = usersController;