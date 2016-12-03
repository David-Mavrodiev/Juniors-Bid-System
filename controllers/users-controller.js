"use strict";
const helper = require('../utils/helper');
const constants = require('../utils/constants');
const multer = require('multer');
const upload = multer().single('userPhoto');
const fs = require('fs');

function usersController(data) {
    return {
        getHome(req, res, errorMessage) {
            let username, imageUrl;
            if (req.isAuthenticated()) {
                username = req.user.image ? req.user.username : 'newuser';
                imageUrl = '/static/profileimages/' + username + '.jpg';
            }

            res.render('home', {
                result: {
                    isAuthenticated: req.isAuthenticated(),
                    imageUrl: imageUrl,
                    user: req.user
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
                let username, imageUrl;
                if (req.isAuthenticated()) {
                    username = req.user.image ? req.user.username : 'newuser';
                    imageUrl = '/static/profileimages/' + username + '.jpg';
                }

                res.render("profile", {
                    result: {
                        username: req.user.username,
                        image: req.user.image,
                        imageUrl: imageUrl,
                        offers: req.user.offers,
                        isAuthenticated: req.isAuthenticated(),
                        user: req.user
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
            upload(req, res, function (err) {
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
        },
        createOffer(username, offer) {
            data.addOffer(username, offer);
        },
        updateOffer(username, auctionId, newAmount) {
            data.updateUserOffer(username, auctionId, newAmount);
        },
        getProfileByUsername(req, res) {
            data.findUserByUsername(req.params.username).
                then((user) => {
                    const imageUrl = '/static/profileimages/' + user.username + '.jpg';

                    res.render('profile', {
                        result: {
                            isAuthenticated: req.isAuthenticated(),
                            username: user.username,
                            offers: user.offers,
                            imageUrl: imageUrl,
                            user: user
                        }
                    });
                });
        }
    };
};

module.exports = usersController;