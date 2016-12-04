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

            data.getNewestAuctions(5)
                .then(auctions => {
                    let renderObject = {
                        result: {
                            isAuthenticated: req.isAuthenticated(),
                            imageUrl: imageUrl,
                            user: req.user,
                            auctions: auctions
                        },
                        error: helper.getErrorMessage(errorMessage)
                    }

                    res.render('home', renderObject);
                });
        },
        createAdmin(req, res) {
            let username = req.body.username;
            console.log(username)
            data.findUserByUsername(username).then(user => {
                console.log(user);
                user.IsAdmin = true;
                user.save()
                res.send("ok");
            });
        },
        getCreateAdmin(req, res) {
            let username, imageUrl;
            if (req.isAuthenticated()) {
                username = req.user.image ? req.user.username : 'newuser';
                imageUrl = '/static/profileimages/' + username + '.jpg';
            }

            //console.log("Is Admin : " + req.isAuthenticated() + " " + req.user.IsAdmin)
            if (req.isAuthenticated() && req.user.IsAdmin) {
                data.getAllUsers()
                    .then(users => {
                        let notAdmins = [];
                        for (let i = 0; i < users.length; i++) {
                            if (!users[i].IsAdmin) {
                                console.log(users[i].username);
                                notAdmins.push(users[i]);
                            }
                        }
                        res.render('admins-create', {
                            result: {
                                isAuthenticated: req.isAuthenticated(),
                                imageUrl: imageUrl,
                                user: req.user,
                                users: notAdmins
                            }
                        });
                    });
            }
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

                const offers = req.user.offers.map((offer) => {
                    return {
                        auctionId: offer.auctionId,
                        auctionTitle: offer.auctionTitle,
                        amount: helper.formatMoney(offer.amount, constants.siteCurrency.big, constants.siteCurrency.small)
                    };
                });

                res.render("profile", {
                    result: {
                        username: req.user.username,
                        image: req.user.image,
                        imageUrl: imageUrl,
                        offers: offers,
                        isAuthenticated: req.isAuthenticated(),
                        isAuthenticatedCurrent: req.isAuthenticated(),
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
        },
        createOffer(username, offer) {
            data.addOffer(username, offer);
        },
        updateOffer(username, auctionId, newAmount) {
            data.updateUserOffer(username, auctionId, newAmount);
        },
        getProfileByUsername(req, res) {
            let urlParted = req.url.split('/');
            let name = urlParted[urlParted.length - 1];
            data.findUserByUsername(name).
            then((user) => {
                const imageUrl = '/static/profileimages/' + user.username + '.jpg';

                const offers = user.offers.map((offer) => {
                    return {
                        auctionId: offer.auctionId,
                        auctionTitle: offer.auctionTitle,
                        amount: helper.formatMoney(offer.amount, constants.siteCurrency.big, constants.siteCurrency.small)
                    };
                });

                res.render('profile', {
                    result: {
                        isAuthenticated: req.isAuthenticated(),
                        isAuthenticatedCurrent: req.isAuthenticated() && user.username === req.user.username,
                        username: user.username,
                        offers: offers,
                        imageUrl: imageUrl,
                        user: req.user
                    }
                });
            });
        }
    };
};

module.exports = usersController;