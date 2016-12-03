"use strict";
const helper = require('../utils/helper');
const constants = require('../utils/constants');
const multer = require('multer');
const upload = multer().single('userPhoto');
const fs = require('fs');

module.exports = function (data) {
    return {
        getHome(req, res) {
            const user = req.user;
            let isAuthenticated = helper.isAuthenticated(req);
            let imageUrl;

            if (user) {
                imageUrl = '/static/profileimages/' + user.username + '.jpg';
            }

            res.render('home', {
                result: {
                    isAuthenticated: req.isAuthenticated(),
                    imageUrl: imageUrl
                }
            })
        },
        getLogin(req, res) {
            //TODO Fix if person is logged in dont allow him to visit login page
            res.render('login', helper.isAuthenticated(req));
        },
        getProfile(req, res) {
            if (!req.isAuthenticated()) {
                res.status(401).redirect('/unauthorized', constants.notLoggedIn);
            } else {
                const username = req.user.image ? req.user.username : 'newuser';

                const imageUrl = '/static/profileimages/' + username + '.jpg';

                res.render("profile", {
                    result: {
                        username: req.user.username,
                        image: req.user.image,
                        imageUrl: imageUrl,
                        offers: req.user.offers,
                        isAuthenticated: req.isAuthenticated(),
                    }
                });
            }
        },
        getUnauthorized(req, res) {
            res.render("unauthorized", constants.notLoggedIn);
        },
        getRegister(req, res) {
            //TODO Fix if person is logged in dont allow him to visit login page
            res.render("register", constants.notLoggedIn);
        },
        uploadImage(req, res) {
            upload(req, res, function (err) {
                if (err) {
                    return res.end(JSON.stringify(err));
                }

                data.updateUserImage(req.user.username, req.file.buffer)
                    .then((user) => {
                        fs.writeFileSync('./public/profileimages/' + user.username + '.jpg', new Buffer(req.file.buffer));
                        res.redirect('/profile');
                    });
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
                    const username = req.user.image ? req.user.username : 'newuser';

                    const imageUrl = '/static/profileimages/' + username + '.jpg';

                    res.render('profile', {
                        result: {
                            isAuthenticated: req.isAuthenticated(),
                            username: user.username,
                            offers: user.offers,
                            imageUrl: imageUrl
                        }
                    });
                });
        }
    };
};